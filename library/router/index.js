import { component } from '../component.js';
import { LazyRoute } from './lazy.js';

export * from './lazy.js';

/** @type {Router | undefined } */
let ROUTER_INSTANCE = undefined;

export class Router {
  /** @param {Route[]} routes */
  constructor(routes) {
    this.routes = routes;
  }

  currentHistoryIndex = 0;

  /** @type {Map<Element, Route>} */
  activeRoutes = new Map();

  /** @type {Element[]} */
  outlets = [];

  /** @type {import('../component.js').BulletElement<{to: string}>[]} */
  links = [];

  /**
   * Pushes the specified path to the browser's history and renders the corresponding route component.
   *
   * @param {string} path - The path to navigate to.
   * @throws {Error} If the specified path does not match any defined route.
   */
  navigate(path) {
    if (window.location.pathname === path) {
      return;
    }

    if (this.load({ path })) {
      history.pushState({ index: this.currentHistoryIndex }, '', path);
    }
  }

  /**
   * Loads the route component corresponding to the specified path into the `<router-outlet>`
   * element.
   *
   * @param {{event?: PopStateEvent, path: string }} data
   */
  load(data) {
    const { event, path } = data;

    const newHistoryIndex = event?.state
      ? event.state.index
      : this.currentHistoryIndex;

    let direction;
    if (newHistoryIndex > this.currentHistoryIndex) {
      direction = 'forward';
    } else if (newHistoryIndex < this.currentHistoryIndex) {
      direction = 'backward';
    } else {
      direction = 'undefined';
    }

    if (direction === 'forward' || direction === 'undefined') {
      this.currentHistoryIndex += 1;
    }

    if (direction === 'backward') {
      this.currentHistoryIndex -= 1;
    }

    // If the Outlet component has not been instantiated, do nothing.
    if (!this.Outlet.componentId) {
      return;
    }

    if (path.startsWith('/')) {
      try {
        new URL(window.location.origin + path);
      } catch (error) {
        console.error(`Invalid path: ${path}`);
        return;
      }
    } else {
      console.error(`Invalid path: ${path}`);
      return;
    }

    const pathSegments = ['/'].concat(path.split('/').filter(Boolean));

    // Find the route corresponding to the specified path.
    /** @type {Route[]} */
    const routeMatches = [];
    findRouteMatches(this.routes, pathSegments, routeMatches);

    if (
      routeMatches.length === 0 ||
      !routeMatches[routeMatches.length - 1].path.endsWith(
        pathSegments[pathSegments.length - 1]
      )
    ) {
      console.error(`No route matches path: ${path}`);
      const outlet = this.outlets[this.outlets.length - 1];
      this.activeRoutes.delete(outlet);
      outlet?.shadowRoot?.replaceChildren(emptyRoute(path));
      return true;
    }

    const newActiveRoutes = new Map();

    // Activate route links
    for (const link of this.links) {
      link.removeAttribute('active');
    }

    for (let i = 0; i < routeMatches.length; i++) {
      const route = routeMatches[i];
      const outlet = this.outlets[i];
      const builtRoute = routeMatches
        .slice(0, i + 1)
        .map((r) => r.path.replace(/\//g, ''))
        .join('/');

      newActiveRoutes.set(outlet, route);
      const matchingLinks = this.links.filter((link) => {
        return link.data.to === builtRoute;
      });
      for (const link of matchingLinks) {
        link.toggleAttribute('active', true);
      }

      if (outlet === undefined || this.activeRoutes.get(outlet) === route) {
        continue;
      }

      /** @type {Node?} */
      let replacementNode = null;

      try {
        if (route?.component instanceof LazyRoute) {
          const imported = route.component.importer();
          if (imported instanceof Promise) {
            imported.then((component) => {
              replacementNode = component.default();
              outlet.shadowRoot?.replaceChildren(replacementNode);
            });

            continue;
          }

          replacementNode = imported();
          outlet.shadowRoot?.replaceChildren(replacementNode);

          continue;
        }

        replacementNode = route?.component() ?? null;
      } catch (error) {
        console.error(error);
      }

      outlet.shadowRoot?.replaceChildren(replacementNode ?? emptyRoute(path));
    }
    this.activeRoutes = newActiveRoutes;

    const lastRouteMatch = routeMatches[routeMatches.length - 1];
    if (lastRouteMatch.redirect) {
      this.navigate(lastRouteMatch.redirect);
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
    return component({
      tag: 'route-outlet',
      onMounted() {
        // @ts-ignore
        self.outlets.push(this);
      },

      onUnMounted() {
        // @ts-ignore
        self.outlets.splice(self.outlets.indexOf(this), 1);
      },

      render: () => document.createElement('slot'),
    });
  })();

  /**
   * Defines a custom `<route-link>` component that renders an `<a>` element and handles click events to navigate to the specified route.
   *
   * @param {RouteLinkProps} props - The component props.
   * @param {string} props.to - The path to navigate to when the link is clicked.
   * @returns {HTMLElement} The rendered `<route-link>` component.
   */
  Link = ((/** @type {RouteLinkProps} */ props) => {
    const self = this;

    return component({
      tag: 'route-link',
      defaultProps: props,

      onMounted() {
        // @ts-ignore
        self.links.push(this);
      },

      data(props) {
        return {
          to: props.to,
        };
      },

      render(props) {
        const a = document.createElement('a');
        a.href = props.to;

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

      onUnMounted() {
        // @ts-ignore
        self.links.splice(self.links.indexOf(this), 1);
      },

      styles: `
        :host([plain]) a {
          text-decoration: none;
          color: inherit;
        }
      `,
    });
  })();
}
/**
 * Creates a new web router instance with the provided options.
 *
 * The web router is a client-side routing solution that allows for navigation between different components or views within a web application. It handles browser history management, URL updates, and rendering the appropriate component based on the current URL path.
 *
 * @module Router
 * @param {RouterOptions} routerOptions - The options for configuring the router.
 * @returns {Router} The created router instance.
 *
 * @example
 * // import the routes.
 * import appHome from './components/app-home.js';
 * import appAbout from './components/app-about.js';
 * // Define the routes
 * const routes = [
 *   {
 *     path: '/',
 *     component: appHome
 *   },
 *   {
 *     path: '/about',
 *     component: appAbout
 *   }
 * ];
 *
 * // Create the router instance
 * const router = createWebRouter({ routes });
 *
 * // Start the router
 * document.querySelector('#root').append(router.Outlet());
 */
export function createWebRouter(routerOptions) {
  const router = new Router(/** @type {Route[]} */ (routerOptions.routes));

  window.addEventListener('popstate', (event) => {
    router.load({ event, path: location.pathname });
  });

  window.addEventListener('load', () => {
    router.load({ path: location.pathname });
  });

  ROUTER_INSTANCE = router;

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
 * @typedef RouteLinkProps
 * @property {string} to
 * The path to navigate to when the link is clicked.
 * @property {boolean} plain
 * If `true`, the link will reset the default styles for the `<a>` element.
 * @property {string} [class]
 * The CSS class to apply to the link.
 */

/**
 * @typedef RouterOptions
 * @property {string} [namespace]
 * The namespace of the router, which would prevent it from clashing with other
 * instances of the Router class. If only one router is needed, this can be omitted.
 * @property {RouteItem[]} routes
 */

/**
 * @typedef {RouteItem & { isActive: boolean }} Route
 */

/**
 * @typedef RouteItem
 * @property {string} path
 * @property {import("../component.js").Component<{}> | LazyRoute} component
 * @property {RouteItem[]} [children]
 * @property {string} [redirect]
 */

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

/**
 * Finds all routes that match the given path.
 *
 * @param {RouteItem[]} routes - An array of route items to search through.
 * @param {string[]} pathSegments - An array of path segments to search for in the routes.
 * @param {RouteItem[]} matches - The result array to append the matching routes to.
 */
function findRouteMatches(routes, pathSegments, matches = []) {
  for (const route of routes) {
    if (route.path === pathSegments[0]) {
      matches.push(route);

      if (route.children !== undefined) {
        findRouteMatches(route.children, pathSegments.slice(1), matches);
      }

      return;
    }
  }
}
