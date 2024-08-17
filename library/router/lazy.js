/// @adbl-bullet

/**
 * @typedef {() => (Promise<{
 *  default: import('../component.js').Component<{}>
 * }> | import('../component.js').Component<{}>)} LazyRouteLoader
 */

export class LazyRoute {
  /** @param {LazyRouteLoader} importer */
  constructor(importer) {
    this.importer = importer;
  }
}

/**
 * Creates a new `LazyRoute` instance that can be used to lazily load and render a component.
 *
 * @param {LazyRouteLoader} importer - A function that returns a Promise that resolves to the component to be rendered.
 * @returns {LazyRoute} A new `LazyRoute` instance.
 */
export function lazy(importer) {
  return new LazyRoute(importer);
}
