// @bullet-resolve-ignore

import { createElement, css } from '../component.js';
import { LazyRoute } from './lazy.js';
import { RouterMiddleware, RouterMiddlewareResponse } from './middleware.js';
import { MatchedRoute, RouteTree } from './routeTree.js';
import { getWindowContext } from '../shim.js';

export * from './lazy.js';
export * from './routeTree.js';
export * from './middleware.js';

/**
 * @typedef {import('./routeTree.js').RouteRecords<ReturnType<import('../component.js').ElementConstructor> | LazyRoute>} RouteRecords
 */

/**
 * @template T
 * @typedef {T extends Array<infer U> ? U : T} UnwrapArray
 */

/**
 * @typedef {UnwrapArray<RouteRecords>} RouteRecord
 */

/** @type {Router | null } */
let ROUTER_INSTANCE = null;

/**
 * @typedef RouterOptions
 * @property {RouteRecords} routes
 * The routes to be rendered by the router.
 * @property {RouterMiddleware[]} [middlewares]
 * Middleware to be executed before each route change.
 * @property {number} [maxRedirects]
 * The maximum number of redirects to allow before the router stops and throws an error.
 */

/**
 * @typedef RouteLinkProps
 * @property {string} to
 * The path to navigate to when the link is clicked.
 * @property {boolean} [plain]
 * If `true`, the link will reset the default styles for the `<a>` element.
 */

export class Router {
  /** @private @type {ReturnType<ReturnType<import('../component.js').ElementConstructor>>[]} */
  outlets;

  /** @private @type {HTMLElement[]} */
  links;

  /** @type {Map<string, string>} */
  params;

  /** @private RouteTree<ReturnType<import('../component.js').ElementConstructor>> */
  routeTree;

  /** @private RouterMiddleware[] */
  middlewares;

  /** @private @type {import('./middleware.js').RouteData | null} */
  currentPath;

  /** @private @type {number} */
  redirectStackCount;

  /** @private @type {number} */
  maxRedirects;

  /** @type {Promise<boolean>} */
  rendering;

  /** @param {RouterOptions} routeOptions */
  constructor(routeOptions) {
    this.routeTree = RouteTree.fromRouteRecords(routeOptions.routes);
    this.middlewares = routeOptions.middlewares ?? [];
    this.maxRedirects = routeOptions.maxRedirects ?? 50;
    this.currentPath = null;
    this.redirectStackCount = 0;
    this.rendering = Promise.resolve(false);
    this.outlets = [];
    this.links = [];
    this.params = new Map();

    /**
     * Defines a custom component that serves as the router outlet, rendering the component
     * associated with the current route.
     *
     * This component is used internally by the `Router` class to handle route changes and
     * render the appropriate component.
     */
    this.Outlet = (() => {
      const window = getWindowContext();
      const self = this;
      return createElement({
        tag: 'router-outlet',
        connected: function () {
          self.outlets.push(this);
        },
        disconnected: function () {
          self.outlets.splice(self.outlets.indexOf(this), 1);
        },
        render: () => window.document.createElement('slot'),
      });
    })();

    /**
     * Defines a custom `<router-link>` component that renders an `<a>` element and handles click events to navigate to the specified route.
     *
     * @param {RouteLinkProps} props - The component props.
     * @param {string} props.to - The path to navigate to when the link is clicked.
     * @returns {HTMLElement} The rendered `<router-link>` component.
     */
    this.Link = ((/** @type {RouteLinkProps} */ props) => {
      const window = getWindowContext();
      const self = this;

      return createElement({
        tag: 'router-link',
        defaultProps: props,
        connected: function () {
          self.links.push(this);
        },
        /** @param {RouteLinkProps} props */
        render: function (props) {
          const a = window.document.createElement('a');
          a.href = props.to;
          this.dataset.href = props.to;

          a.addEventListener('click', (event) => {
            event.preventDefault();
            self.navigate(props.to);
          });
          a.setAttribute('part', 'inner');
          a.append(window.document.createElement('slot'));

          if (props.plain) {
            this.toggleAttribute('plain', true);
          }

          return a;
        },
        disconnected: function () {
          self.links.splice(self.links.indexOf(this), 1);
        },
        styles: css`
          :host {
            display: inline-block;
          }
          :host([plain]) a {
            display: inline-block;
            width: 100%;
            height: 100%;
            text-decoration: none;
            color: inherit;
          }
        `,
      });
    })();
  }

  /**
   * Pushes the specified path to the browser's history and renders the corresponding route component.
   *
   * @param {string} path - The path to navigate to.
   * @return {Promise<undefined>}
   */
  navigate = async (path) => {
    if (path === '#') {
      return;
    }
    await this.loadPath(path, true);
    return;
  };

  /**
   * Navigates back in the browser's history.
   */
  async back() {
    const window = getWindowContext();
    window.history.back();
  }

  /**
   * Loads the route component corresponding to the specified path into the `<router-outlet>`
   * element.
   *
   * @param {string} path
   * @returns {Promise<boolean>} A promise that resolves to `true` if the route was loaded successfully, `false` otherwise.
   */
  updateDOMWithMatchingPath = async (path) => {
    const window = getWindowContext();
    if (path === '#') {
      return false;
    }

    const matchResult = this.routeTree.match(path);

    matchResult.flattenTransientRoutes();
    this.params = matchResult.params;

    const targetMatch = matchResult.leaf();
    if (targetMatch !== null) {
      const sourcePath = this.currentPath
        ? {
            name: this.currentPath.name,
            params: this.currentPath.params,
            query: this.currentPath.query,
            fullPath: this.currentPath.fullPath,
          }
        : null;

      const targetPath = {
        name: targetMatch.name,
        params: matchResult.params,
        query: matchResult.searchQueryParams,
        fullPath: targetMatch.fullPath,
      };

      const middlewareArgs = {
        from: sourcePath,
        to: targetPath,
      };

      for (const middleware of this.middlewares) {
        const middlewareResponse = await middleware.callback(middlewareArgs);
        if (middlewareResponse instanceof RouterMiddlewareResponse) {
          if (middlewareResponse.type === 'redirect') {
            // Block deep redirects
            if (this.redirectStackCount > this.maxRedirects) {
              const message = `Your router redirected too many times (${this.maxRedirects}). This is probably due to a circular redirect in your route configuration.`;
              console.warn(message);
              return false;
            }

            // Ignore same-path redirects
            if (middlewareResponse.path === path) {
              continue;
            }

            this.redirectStackCount++;
            await this.navigate(middlewareResponse.path);
            return false;
          }
        }
      }
    }

    if (matchResult.subTree === null) {
      console.warn(`No route matches path: ${path}`);
      const outlet = this.outlets[0];
      outlet?.removeAttribute('data-path');
      outlet?.replaceChildren(emptyRoute(path));
      return true;
    }

    /** @type {MatchedRoute<ReturnType<import('../component.js').ElementConstructor> | LazyRoute> | null} */
    let lastMatchedRoute = matchResult.subTree;
    /** @type {MatchedRoute<ReturnType<import('../component.js').ElementConstructor> | LazyRoute> | null} */
    let currentMatchedRoute = matchResult.subTree;
    let outletIndex = 0;

    while (currentMatchedRoute) {
      const outlet = this.outlets[outletIndex];

      if (outlet === undefined) {
        break;
      }

      if (outlet.hasAttribute('ct-static')) {
        outlet.removeAttribute('ct-static');
        outlet.removeAttribute('data-path');
      }

      if (outlet.dataset.path !== currentMatchedRoute.fullPath) {
        const matchedComponentOrLazyLoader = currentMatchedRoute.component;

        /** @type {ReturnType<import('../component.js').ElementConstructor>} */
        let matchedComponent;

        if (
          matchedComponentOrLazyLoader === null ||
          matchedComponentOrLazyLoader === undefined
        ) {
          const outlet = this.outlets[outletIndex];
          if (currentMatchedRoute.child) {
            currentMatchedRoute = currentMatchedRoute.child;
            continue;
          }
          if (currentMatchedRoute.redirect) {
            await this.navigate(currentMatchedRoute.redirect);
            return false;
          }

          console.warn(`No component from route: ${path}`);
          outlet?.removeAttribute('data-path');
          outlet?.replaceChildren(emptyRoute(path));
          return true;
        }

        if (matchedComponentOrLazyLoader instanceof LazyRoute) {
          const component = await matchedComponentOrLazyLoader.importer();
          if ('default' in component) {
            matchedComponent = component.default;
          } else {
            matchedComponent = component;
          }
        } else {
          matchedComponent = matchedComponentOrLazyLoader;
        }

        outlet.dataset.path = currentMatchedRoute.fullPath;
        const renderedComponent = matchedComponent();

        // if the component performs a redirect, it would change the route
        // stored in the outlet's dataset, so we need to check before replacing.
        if (outlet.dataset.path === currentMatchedRoute.fullPath) {
          outlet.replaceChildren(renderedComponent);
          if (currentMatchedRoute.title) {
            window.document.title = currentMatchedRoute.title;
          }
        } else {
          return false;
        }
      }

      outletIndex++;
      lastMatchedRoute = currentMatchedRoute;
      currentMatchedRoute = currentMatchedRoute.child;
    }

    for (const spareOutlet of this.outlets.slice(outletIndex)) {
      spareOutlet.removeAttribute('data-route-name');
      spareOutlet.replaceChildren();
    }

    if (lastMatchedRoute.redirect && lastMatchedRoute.redirect !== path) {
      await this.navigate(lastMatchedRoute.redirect);
    }

    this.currentPath = {
      name: lastMatchedRoute.name,
      params: matchResult.params,
      query: matchResult.searchQueryParams,
      fullPath: lastMatchedRoute.fullPath,
    };

    if (this.redirectStackCount > 0) {
      this.redirectStackCount--;
    }
    return true;
  };

  /**
   * Connects a router outlet to the router and navigates to a specified path.
   * Performs the same operation that will occur when the outlet is connected to the DOM.
   *
   * @param {import('../component.js').BulletElement} outlet - The router outlet element to connect.
   * @param {string} [path='/'] - The path to navigate to after connecting the outlet.
   */
  connect = async (outlet, path = '/') => {
    this.outlets.push(outlet);
    await this.navigate(path);
  };

  /**
   * Loads the matching routes for a path.
   * @param {string} path
   * @param {boolean} [navigate]
   * @param {Event} [_event]
   * Event that triggered the navigation.
   */
  loadPath = async (path, navigate, _event) => {
    const window = getWindowContext();
    if (this.currentPath?.fullPath === path) {
      return;
    }

    const wasLoaded = await this.updateDOMWithMatchingPath(path);

    for (const link of this.links) {
      link.toggleAttribute(
        'active',
        Boolean(
          this.currentPath?.fullPath &&
            link.dataset.href?.startsWith(this.currentPath.fullPath)
        )
      );
    }

    if (navigate && wasLoaded) {
      window.history.pushState(null, '', path);
    }
  };

  isLoading = false;
}

/**
 * Creates a new web-based router instance with the provided route configurations.
 *
 * This function sets up the necessary event listeners for handling browser history events and initial page load, and assigns the created router instance to the global `ROUTER_INSTANCE` variable.
 *
 * @param {RouterOptions} routerOptions - The options object for configuring the router.
 * @returns {Router} The created router instance.
 */
export function createWebRouter(routerOptions) {
  const router = new Router(routerOptions);
  const window = getWindowContext();
  ROUTER_INSTANCE = router;

  if (window.__BULLET_WINDOW_CONTEXT_OPTIONS__?.addRouterWindowListeners) {
    window.addEventListener('popstate', async (event) => {
      if (Reflect.get(router, 'outlets').length > 0 && !router.isLoading) {
        router.isLoading = true;
        await router.loadPath(window.location.pathname, false, event);
        router.isLoading = false;
      }
    });

    window.addEventListener('hashchange', async (event) => {
      if (Reflect.get(router, 'outlets').length > 0 && !router.isLoading) {
        router.isLoading = true;
        await router.loadPath(window.location.hash, false, event);
        router.isLoading = false;
      }
    });

    window.addEventListener('load', async (event) => {
      if (Reflect.get(router, 'outlets').length > 0 && !router.isLoading) {
        router.isLoading = true;
        await router.loadPath(window.location.pathname, false, event);
        router.isLoading = false;
      }
    });

    window.addEventListener('DOMContentLoaded', async (event) => {
      if (Reflect.get(router, 'outlets').length > 0 && !router.isLoading) {
        router.isLoading = true;
        await router.loadPath(window.location.pathname, false, event);
        router.isLoading = false;
      }
    });
  }

  return router;
}

/**
 * Returns the singleton instance of the Router class.
 *
 * The Router class manages the routing logic and provides methods for navigating between routes, rendering components, and handling browser history events.
 *
 * @returns {Router} The Router instance.
 *
 * @example
 * // Get the router instance
 * const router = useRouter();
 *
 * // Navigate to a new route
 * router.navigate('/about');
 */
export function useRouter() {
  if (!ROUTER_INSTANCE) {
    throw new Error('Router not initialized');
  }
  return ROUTER_INSTANCE;
}

/**
 * Wrapper function for defining route records.
 *
 * @param {RouteRecords} routes
 */
export function defineRoutes(routes) {
  return routes;
}

/**
 * Generates a DocumentFragment node with a text node indicating that the specified route path was not found.
 *
 * @param {string} path - The route path that was not found.
 * @returns {DocumentFragment} A DocumentFragment node containing a text node with the "Route not found" message.
 */
function emptyRoute(path) {
  const window = getWindowContext();
  console.warn(`Route not found: ${path}`);
  const node = new window.DocumentFragment();
  node.appendChild(window.document.createTextNode(`Route not found: ${path}`));
  return node;
}
