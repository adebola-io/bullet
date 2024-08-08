import { ObservableMap } from './helpers/index.js';

/** @type {Map<string, any>} */
export const CUSTOM_ELEMENT_MAP = new Map();

/** @type {ObservableMap<string, Array<CSSStyleSheet | Promise<CSSStyleSheet>>>} */
export const CUSTOM_ELEMENT_STYLES = new ObservableMap();

/** @type {ObservableMap<string, {  data: Array<CSSStyleSheet | Promise<CSSStyleSheet>>, instances: number }>} */
export const CUSTOM_ELEMENT_GLOBAL_STYLES = new ObservableMap();

/** @type {ObservableMap<string, HTMLElement>} */
export const CUSTOM_ELEMENT_INSTANCE_CACHE = new ObservableMap();

/** @type {Map<string, Map<string, any>>} */
export const GLOBAL_DATA = new Map();

/** @type {boolean} */
// @ts-ignore
const isDevMode = import.meta.env.DEV;

/**
 * Keeps track of constructed custom elements so they can be reached during HMR.
 * @type {{
 *   get: (key: string) => Map<any, any> | undefined;
 *   set: (key: string, value: Map<any, any>) => void;
 *   has: (key: string) => boolean;
 *   delete: (value: Map<any, any>) => void;
 * }}
 */
export const CUSTOM_ELEMENT_NODE_LIST = isDevMode
  ? new Map()
  : {
      get: () => undefined,
      set: () => {},
      has: () => false,
      delete: () => {},
    };
