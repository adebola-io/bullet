/**
 * @typedef {(pathDetails: PathDetails) => string} MiddlewareCallback
 */

/**
 * @typedef {Object} PathDetails
 *
 * @property {string} from - The path from which the user is navigating.
 * @property {string} to - The path to which the user is navigating.
 */

class RouterMiddleware {
  /** @type {MiddlewareCallback} */ callback;

  /**
   * Constructs a new `RouterMiddleware` instance with the provided callback function.
   *
   * @param {MiddlewareCallback} callback - The callback function to be executed when the middleware is invoked.
   */
  constructor(callback) {
    this.callback = callback;
  }
}

/**
 * Defines a new middleware function for the router.
 *
 * @param {MiddlewareCallback} callback - The callback function to be executed when the middleware is invoked.
 * @returns {RouterMiddleware} - A new `RouterMiddleware` instance with the provided callback function.
 */
export function defineMiddleware(callback) {
  return new RouterMiddleware(callback);
}
