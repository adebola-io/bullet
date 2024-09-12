/**
 * @typedef {Window & typeof globalThis & {
 *   __BULLET_WINDOW_CONTEXT_OPTIONS__?: WindowContextOptions
 * }} WindowContext
 */
/**
 * Sets the global window context for use by the `getWindowContext()` function in non-browser environments.
 * @param {object} window - The global window object to use as the window context.
 * @param {WindowContextOptions} [options] - The options object for configuring the window context.
 */
export function setWindowContext(window: object, options?: WindowContextOptions | undefined): Promise<void>;
/**
 * Returns the global window context if it exists, otherwise returns a shim.
 * The shim provides a minimal implementation of the window object to prevent errors when running in non-browser environments.
 *
 * @returns {WindowContext} The global window context or a shim.
 */
export function getWindowContext(): WindowContext;
/**
 * Initializes the BulletComponent class, which extends the HTMLElement interface.
 * The BulletComponent class has a `render` property that is a function that returns a
 * `Template` object from the './component.js' module.
 */
export function initializeBulletComponent(): void;
/**
 * @type {typeof HTMLElement}
 */
export let BulletComponent: typeof HTMLElement;
export type WindowContextOptions = {
    /**
     * Whether to initialize the BulletComponent class.
     */
    initializeBulletComponent?: boolean | undefined;
    /**
     * Whether to add the listeners for the popstate, hashchange, and load events to the window object.
     */
    addRouterWindowListeners?: boolean | undefined;
    /**
     * Whether to run the connected callbacks for custom elements after they are connected to the document.
     */
    runConnectedCallbacks?: boolean | undefined;
};
export type WindowContext = Window & typeof globalThis & {
    __BULLET_WINDOW_CONTEXT_OPTIONS__?: WindowContextOptions;
};
