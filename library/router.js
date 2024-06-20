import { defineComponent } from './defineComponent.js';

/** @type {Router | undefined } */
let ROUTER_INSTANCE = undefined;

export class Router {
  /** @param {RouteItem[]} routes */
  constructor(routes) {
    this.routes = routes;
  }

  currentHistoryIndex = 0;

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

    // Find the Outlet element in the DOM.
    const outlet = document.querySelector(
      this.Outlet.componentId.replace('.', '\\.')
    );

    // If the Outlet element is not found, do nothing.
    if (outlet === null) {
      return;
    }

    // Find the route corresponding to the specified path.
    const route = this.routes.find((route) => route.path === path);

    // Create the replacement node for the Outlet element. If the route is not found,
    // create a text node with an error message.
    let replacementNode = /** @type {Node} */ (route?.component());
    if (replacementNode === undefined) {
      console.warn(`Route not found: ${path}`);
      replacementNode = new DocumentFragment();
      replacementNode.appendChild(
        document.createTextNode(`Route not found: ${path}`)
      );
    }

    outlet.shadowRoot?.replaceChildren(replacementNode);
    return true;
  }

  /**
   * Instantiates the custom components (`<router-outlet>` and `<route-link>`)
   * used by the router.
   */
  instantiate() {
    this.Outlet();
    this.Link();
  }

  /**
   * Defines a custom component that serves as the router outlet, rendering the component
   * associated with the current route.
   *
   * This component is used internally by the `Router` class to handle route changes and
   * render the appropriate component.
   */

  Outlet = (() => {
    return defineComponent({
      tag: 'router-outlet',

      render() {
        return document.createElement('slot');
      },
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

    return defineComponent({
      tag: 'route-link',
      defaultProps: props,
      render(props) {
        const a = document.createElement('a');
        a.href = props.to;

        a.addEventListener('click', (event) => {
          event.preventDefault();
          self.navigate(props.to);
        });
        a.append(document.createElement('slot'));
        return a;
      },
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
  const router = new Router(routerOptions.routes);

  window.addEventListener('popstate', (event) => {
    router.load({ event, path: location.pathname });
  });

  window.addEventListener('load', () => {
    router.load({ path: location.pathname });
  });

  ROUTER_INSTANCE = router;
  router.instantiate();

  return router;
}

/**
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
 * @typedef {{to: string}} RouteLinkProps
 */
/**
 * @typedef RouterOptions
 * @property {string} [namespace]
 * The namespace of the router, which would prevent it from clashing with other
 * instances of the Router class. If only one router is needed, this can be omitted.
 * @property {RouteItem[]} routes
 */

/**
 * @typedef RouteItem
 * @property {string} path
 * @property {import("./defineComponent").ComponentConstructor<any, any, any>} component
 * @property {RouteItem[]} [children]
 */
