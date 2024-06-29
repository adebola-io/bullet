/** @type {Map<string, any>} */
export const CUSTOM_ELEMENT_MAP = new Map();

/** @type {Map<string, CSSStyleSheet>} */
export const CUSTOM_ELEMENT_STYLES = new Map();

/** @type {Map<string, {  data: string, instances: number }>} */
export const CUSTOM_ELEMENT_GLOBAL_STYLES = new Map();

/** @type {Map<string, HTMLElement>} */
export const CUSTOM_ELEMENT_INSTANCE_CACHE = new Map();

/** @type {Map<string, Map<string, any>>} */
export const GLOBAL_DATA = new Map();

/**
 * Holds a list of elements that are currently being built
 * in the current render cycle. This is used to track
 * updates to the DOM data objects.
 */
export const RENDER_TARGET_STACK = {
  /** @type {Element[]} */
  trackedElements: [],

  get length() {
    return this.trackedElements.length;
  },

  /**
   * Returns the last element that was tracked.
   * @returns {Element}
   */
  top() {
    return this.trackedElements[this.trackedElements.length - 1];
  },

  /**
   * Tracks the given element as part of the current render cycle.
   * @param {Element} element
   */
  push(element) {
    this.trackedElements.push(element);
  },

  /**
   * Removes and returns the last element that was tracked.
   * @returns {Element | undefined}
   */
  pop() {
    return this.trackedElements.pop();
  },

  /**
   * Clears the list of tracked elements.
   */
  clear() {
    this.trackedElements = [];
  },
};
