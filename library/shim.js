// @bullet-resolve-ignore
// @ts-nocheck

/**
 * Throws an error indicating that a function or feature is not implemented.
 * @param {string} [message] - An optional message to include in the error.
 * @throws {Error} Always throws an error with the message 'unimplemented'.
 */
function unimplemented(message = 'unimplemented') {
  throw new Error(message);
}

/**
 * Throws an error indicating that a code path should be unreachable.
 * This function is typically used in switch statements or if-else chains
 * where all possible cases should be handled, and reaching this function
 * indicates a logical error in the program.
 *
 * @param {string} [message='unreachable'] - An optional custom message for the error.
 * @throws {Error} Always throws an error with the provided or default message.
 */
function unreachable(message = 'unreachable') {
  throw new Error(message);
}

let windowContext = undefined;

/**
 * @typedef {Window & typeof globalThis & {}} WindowContext
 */

/**
 * Sets the global window context for use by the `getWindowContext()` function in non-browser environments.
 * @param {Window} window - The global window object to use as the window context.
 */
export async function setWindowContext(window) {
  windowContext = window;
  initializeBulletComponent();
}

/**
 * Returns the global window context if it exists, otherwise returns a shim.
 * The shim provides a minimal implementation of the window object to prevent errors when running in non-browser environments.
 *
 * @returns {WindowContext} The global window context or a shim.
 */
export function getWindowContext() {
  if (windowContext) {
    return windowContext;
  }
  if (typeof window !== 'undefined') {
    if (BulletComponent === undefined) {
      BulletComponent = class extends window.HTMLElement {
        /** @type {() => import('./component.js').Template} */ //@ts-ignore
        render;
      };
    }
    return window;
  }

  throw new Error(
    'Window context not found. Please call setWindowContext() before using the shim.'
  );
}

/**
 * @type {typeof HTMLElement}
 */
export let BulletComponent;
/**
 * Initializes the BulletComponent class, which extends the HTMLElement interface.
 * The BulletComponent class has a `render` property that is a function that returns a
 * `Template` object from the './component.js' module.
 */
export function initializeBulletComponent() {
  const window = getWindowContext();
  BulletComponent = class BulletComponent extends window.HTMLElement {
    /** @type {() => import('./component.js').Template} */ //@ts-ignore
    render;

    attachInternals() {}
  };
}
