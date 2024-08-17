/** @type {Map<string, any>} */
export const CUSTOM_ELEMENT_MAP: Map<string, any>;
/** @type {ObservableMap<string, Array<CSSStyleSheet | Promise<CSSStyleSheet>>>} */
export const CUSTOM_ELEMENT_STYLES: ObservableMap<string, Array<CSSStyleSheet | Promise<CSSStyleSheet>>>;
/** @type {ObservableMap<string, {  data: Array<CSSStyleSheet | Promise<CSSStyleSheet>>, instances: number }>} */
export const CUSTOM_ELEMENT_GLOBAL_STYLES: ObservableMap<string, {
    data: Array<CSSStyleSheet | Promise<CSSStyleSheet>>;
    instances: number;
}>;
/** @type {ObservableMap<string, HTMLElement>} */
export const CUSTOM_ELEMENT_INSTANCE_CACHE: ObservableMap<string, HTMLElement>;
/** @type {Map<string, Map<string, any>>} */
export const GLOBAL_DATA: Map<string, Map<string, any>>;
/**
 * Keeps track of constructed custom elements so they can be reached during HMR.
 * @type {{
 *   get: (key: string) => Map<any, any> | undefined;
 *   set: (key: string, value: Map<any, any>) => void;
 *   has: (key: string) => boolean;
 *   delete: (value: Map<any, any>) => void;
 * }}
 */
export const CUSTOM_ELEMENT_NODE_LIST: {
    get: (key: string) => Map<any, any> | undefined;
    set: (key: string, value: Map<any, any>) => void;
    has: (key: string) => boolean;
    delete: (value: Map<any, any>) => void;
};
import { ObservableMap } from './helpers/index.js';
