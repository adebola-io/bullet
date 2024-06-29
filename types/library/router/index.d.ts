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
export function createWebRouter(routerOptions: RouterOptions): Router;
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
export function useRouter(): Router;
export * from "./lazy.js";
export class Router {
    /** @param {Route[]} routes */
    constructor(routes: Route[]);
    routes: Route[];
    currentHistoryIndex: number;
    /** @type {Map<Element, Route>} */
    activeRoutes: Map<Element, Route>;
    /** @type {Element[]} */
    outlets: Element[];
    /** @type {import('../component.js').BulletElement<{to: string}>[]} */
    links: import("../component.js").BulletElement<{
        to: string;
    }>[];
    /**
     * Pushes the specified path to the browser's history and renders the corresponding route component.
     *
     * @param {string} path - The path to navigate to.
     * @throws {Error} If the specified path does not match any defined route.
     */
    navigate(path: string): void;
    /**
     * Loads the route component corresponding to the specified path into the `<router-outlet>`
     * element.
     *
     * @param {{event?: PopStateEvent, path: string }} data
     */
    load(data: {
        event?: PopStateEvent;
        path: string;
    }): true | undefined;
    /**
     * Defines a custom component that serves as the router outlet, rendering the component
     * associated with the current route.
     *
     * This component is used internally by the `Router` class to handle route changes and
     * render the appropriate component.
     */
    Outlet: import("../component.js").Component<Partial<{}>>;
    /**
     * Defines a custom `<route-link>` component that renders an `<a>` element and handles click events to navigate to the specified route.
     *
     * @param {RouteLinkProps} props - The component props.
     * @param {string} props.to - The path to navigate to when the link is clicked.
     * @returns {HTMLElement} The rendered `<route-link>` component.
     */
    Link: import("../component.js").Component<Partial<RouteLinkProps>>;
}
export type RouteLinkProps = {
    /**
     * The path to navigate to when the link is clicked.
     */
    to: string;
    /**
     * If `true`, the link will reset the default styles for the `<a>` element.
     */
    plain: boolean;
    /**
     * The CSS class to apply to the link.
     */
    class?: string | undefined;
};
export type RouterOptions = {
    /**
     * The namespace of the router, which would prevent it from clashing with other
     * instances of the Router class. If only one router is needed, this can be omitted.
     */
    namespace?: string | undefined;
    routes: RouteItem[];
};
export type Route = RouteItem & {
    isActive: boolean;
};
export type RouteItem = {
    path: string;
    component: import("../component.js").Component<{}> | LazyRoute;
    children?: RouteItem[] | undefined;
    redirect?: string | undefined;
};
import { LazyRoute } from './lazy.js';
