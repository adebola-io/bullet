/**
 * @typedef {Window & typeof globalThis & {}} WindowContext
 */
/**
 * Sets the global window context for use by the `getWindowContext()` function in non-browser environments.
 * @param {Window} window - The global window object to use as the window context.
 */
export function setWindowContext(window: Window): Promise<void>;
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
export type WindowContext = Window & typeof globalThis & {};
