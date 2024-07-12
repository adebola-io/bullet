/** @type {Map<string, any>} */
export const CUSTOM_ELEMENT_MAP = new Map();

/** @type {Map<string, CSSStyleSheet>} */
export const CUSTOM_ELEMENT_STYLES = new Map();

/** @type {Map<string, {  data: CSSStyleSheet, instances: number }>} */
export const CUSTOM_ELEMENT_GLOBAL_STYLES = new Map();

/** @type {Map<string, HTMLElement>} */
export const CUSTOM_ELEMENT_INSTANCE_CACHE = new Map();

/** @type {Map<string, Map<string, any>>} */
export const GLOBAL_DATA = new Map();

/**
 * Keeps track of constructed custom elements so they can be reached during HMR.
 * @type {Map<string, Map<HTMLElement, boolean>>}
 */
export const CUSTOM_ELEMENT_NODE_LIST = new Map();
