import { createElement, css } from '../component.js';
import { LazyRoute } from './lazy.js';
import { MatchedRoute, RouteTree } from './routeTree.js';

export * from './lazy.js';
export * from './routeTree.js';

/**
 * @typedef {import('../component.js').ElementConstructor} ElementConstructor
 */

/**
 * @typedef {import('./routeTree.js').RouteRecords<ReturnType<ElementConstructor> | LazyRoute>} RouteRecords
 *
 */

/** @type {Router | null } */
let ROUTER_INSTANCE = null;

/**
 * @typedef RouterOptions
 * @property {RouteRecords} routes
 */

/**
 * @typedef RouteLinkProps
 * @property {string} to
 * The path to navigate to when the link is clicked.
 * @property {boolean} plain
 * If `true`, the link will reset the default styles for the `<a>` element.
 * @property {string} [class]
 * The CSS class to apply to the link.
 */

export class Router {
  /** @private @type {ReturnType<ReturnType<ElementConstructor>>[]} */
  outlets = [];

  /** @private @type {HTMLElement[]} */
  links = [];

  /** @type {Map<string, string>} */
  params = new Map();

  /** @private RouteTree<ReturnType<ElementConstructor>> */ routeTree;

  /** @param {RouterOptions} routeOptions */
  constructor(routeOptions) {
    this.routeTree = RouteTree.fromRouteRecords(routeOptions.routes);
  }

  /**
   * Pushes the specified path to the browser's history and renders the corresponding route component.
   *
   * @param {string} path - The path to navigate to.
   * @return {undefined}
   */
  navigate(path) {
    this.load(path).then((wasLoaded) => {
      if (wasLoaded) {
        history.pushState(null, '', path);
      }
    });
    return;
  }

  /**
   * Navigates back in the browser's history.
   */
  async back() {
    history.back();
  }

  /**
   * Loads the route component corresponding to the specified path into the `<router-outlet>`
   * element.
   *
   * @param {string} path
   * @returns {Promise<boolean>} A promise that resolves to `true` if the route was loaded successfully, `false` otherwise.
   */
  async load(path) {
    const matchResult = this.routeTree.match(path);
    matchResult.flattenTransientRoutes();
    this.params = matchResult.params;

    if (matchResult.subTree === null) {
      console.warn(`No route matches path: ${path}`);
      const outlet = this.outlets[0];
      outlet?.removeAttribute('data-path');
      outlet?.shadowRoot?.replaceChildren(emptyRoute(path));
      return true;
    }

    /** @type {MatchedRoute<ReturnType<ElementConstructor> | LazyRoute> | null} */
    let lastMatchedRoute = matchResult.subTree;
    /** @type {MatchedRoute<ReturnType<ElementConstructor> | LazyRoute> | null} */
    let currentMatchedRoute = matchResult.subTree;
    let outletIndex = 0;

    while (currentMatchedRoute) {
      const outlet = this.outlets[outletIndex];

      if (outlet.dataset.path !== currentMatchedRoute.fullPath) {
        const matchedComponentOrLazyLoader = currentMatchedRoute.component;

        /** @type {ReturnType<ElementConstructor>} */
        let matchedComponent;

        if (
          matchedComponentOrLazyLoader === null ||
          matchedComponentOrLazyLoader === undefined
        ) {
          if (currentMatchedRoute.child) {
            currentMatchedRoute = currentMatchedRoute.child;
            continue;
          }
          console.warn(`No component from route: ${path}`);
          const outlet = this.outlets[outletIndex];
          outlet?.removeAttribute('data-path');
          outlet?.shadowRoot?.replaceChildren(emptyRoute(path));
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
          outlet.shadowRoot?.replaceChildren(renderedComponent);
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
      spareOutlet.shadowRoot?.replaceChildren();
    }

    if (lastMatchedRoute.redirect) {
      this.navigate(lastMatchedRoute.redirect);
    }

    for (const link of this.links) {
      link.toggleAttribute('active', link.dataset.href === path);
    }

    return true;
  }

  /**
   * Defines a custom component that serves as the router outlet, rendering the component
   * associated with the current route.
   *
   * This component is used internally by the `Router` class to handle route changes and
   * render the appropriate component.
   */
  Outlet = (() => {
    const self = this;
    return createElement({
      tag: 'router-outlet',
      connected: function () {
        // @ts-ignore
        self.outlets.push(this);
      },
      disconnected: function () {
        // @ts-ignore
        self.outlets.splice(self.outlets.indexOf(this), 1);
      },
      render: () => document.createElement('slot'),
    });
  })();

  /**
   * Defines a custom `<router-link>` component that renders an `<a>` element and handles click events to navigate to the specified route.
   *
   * @param {RouteLinkProps} props - The component props.
   * @param {string} props.to - The path to navigate to when the link is clicked.
   * @returns {HTMLElement} The rendered `<router-link>` component.
   */
  Link = ((/** @type {RouteLinkProps} */ props) => {
    const self = this;

    return createElement({
      tag: 'router-link',
      defaultProps: props,
      connected: function () {
        // @ts-ignore
        self.links.push(this);
      },
      render: function (props) {
        const a = document.createElement('a');
        a.href = props.to;
        this.dataset.href = props.to;

        a.addEventListener('click', (event) => {
          event.preventDefault();
          self.navigate(props.to);
        });
        a.append(document.createElement('slot'));

        if (props.plain) {
          this.toggleAttribute('plain', true);
        }

        if (props.class) {
          this.classList.add(...props.class.split(' '));
        }
        return a;
      },
      disconnected: function () {
        // @ts-ignore
        self.links.splice(self.links.indexOf(this), 1);
      },
      styles: css`
        :host([plain]) a {
          text-decoration: none;
          color: inherit;
        }
      `,
    });
  })();
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
  ROUTER_INSTANCE = router;

  window.addEventListener('popstate', () => {
    router.load(window.location.pathname);
  });

  window.addEventListener('load', () => {
    router.load(window.location.pathname);
  });

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
 * Generates a DocumentFragment node with a text node indicating that the specified route path was not found.
 *
 * @param {string} path - The route path that was not found.
 * @returns {DocumentFragment} A DocumentFragment node containing a text node with the "Route not found" message.
 */
function emptyRoute(path) {
  console.warn(`Route not found: ${path}`);
  const node = new DocumentFragment();
  node.appendChild(document.createTextNode(`Route not found: ${path}`));
  return node;
}
