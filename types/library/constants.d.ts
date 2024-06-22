/** @type {Map<string, any>} */
export const CUSTOM_ELEMENT_MAP: Map<string, any>;
/** @type {Map<string, CSSStyleSheet>} */
export const CUSTOM_ELEMENT_STYLES: Map<string, CSSStyleSheet>;
/** @type {Map<string, HTMLElement>} */
export const CUSTOM_ELEMENT_INSTANCE_CACHE: Map<string, HTMLElement>;
/** @type {Map<string, Map<string, any>>} */
export const GLOBAL_DATA: Map<string, Map<string, any>>;
export namespace RENDER_TARGET_STACK {
    let trackedElements: Element[];
    const length: number;
    /**
     * Returns the last element that was tracked.
     * @returns {Element}
     */
    function top(): Element;
    /**
     * Tracks the given element as part of the current render cycle.
     * @param {Element} element
     */
    function push(element: Element): void;
    /**
     * Removes and returns the last element that was tracked.
     * @returns {Element | undefined}
     */
    function pop(): Element | undefined;
    /**
     * Clears the list of tracked elements.
     */
    function clear(): void;
}
