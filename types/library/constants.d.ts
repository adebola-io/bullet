/** @type {Map<string, any>} */
export const CUSTOM_ELEMENT_MAP: Map<string, any>;
/** @type {Map<string, CSSStyleSheet>} */
export const CUSTOM_ELEMENT_STYLES: Map<string, CSSStyleSheet>;
/** @type {Map<string, {  data: CSSStyleSheet, instances: number }>} */
export const CUSTOM_ELEMENT_GLOBAL_STYLES: Map<string, {
    data: CSSStyleSheet;
    instances: number;
}>;
/** @type {Map<string, HTMLElement>} */
export const CUSTOM_ELEMENT_INSTANCE_CACHE: Map<string, HTMLElement>;
/** @type {Map<string, Map<string, any>>} */
export const GLOBAL_DATA: Map<string, Map<string, any>>;
/**
 * Keeps track of constructed custom elements so they can be reached during HMR.
 * @type {Map<string, Map<HTMLElement, boolean>>}
 */
export const CUSTOM_ELEMENT_NODE_LIST: Map<string, Map<HTMLElement, boolean>>;
