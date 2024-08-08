/**
 * @typedef InlineSvgProps
 * @property {string} href address of the svg icon to inline.
 */

/** @type {RequestInit} */
const svgFetchOptions = {
  cache: 'force-cache',
};

/**
 * Asynchronously fetches and inlines an SVG icon using its URL.
 * @param {InlineSvgProps} props
 * @returns {Promise<Element>} The SVG element created, or an empty template if the request fails.
 */
export async function InlineSvg(props) {
  try {
    const response = await fetch(props.href, svgFetchOptions);
    const svg = await response.text();
    const range = document.createRange();
    const element = range.createContextualFragment(svg).querySelector('svg');
    return element ?? document.createElement('template');
  } catch (error) {
    console.error('Error fetching SVG:', error);
    return document.createElement('template');
  }
}

/**
 * @template  Key
 * @template Value
 * @typedef ObservableMapEventDetailMap
 * @property {{key: Key, value: Value}} set
 * @property {{key: Key}} get
 * @property {{key: Key}} delete
 * @property {{key: Key}} clear
 */

/**
 * @template Key
 * @template Value
 * @typedef {keyof ObservableMapEventDetailMap<Key, Value>} ObservableMapEventDetailKey
 */

/**
 * @template Key
 * @template Value
 * @template {ObservableMapEventDetailKey<Key, Value>} EventType
 * @typedef {(event: CustomEvent<ObservableMapEventDetailMap<Key, Value>[EventType]>) => void} GetListener
 */

/**
 * @template Key
 * @template Value
 * A reactive store that allows setting and getting values,
 * and dispatches events when values are set or retrieved.
 */
export class ObservableMap extends EventTarget {
  #map = new Map();

  /**
   * Sets a value in the store.
   * @param {Key} key
   * @param {Value} value
   */
  set(key, value) {
    const event = new CustomEvent('set', {
      detail: {
        key,
        value,
      },
    });
    this.dispatchEvent(event);
    this.#map.set(key, value);
  }

  /**
   * Gets a value from the store.
   * @param {Key} key
   * @returns {Value | undefined}
   */
  get(key) {
    const event = new CustomEvent('get', {
      detail: {
        key,
      },
    });
    this.dispatchEvent(event);
    return this.#map.get(key);
  }

  /**
   * Deletes a value from the store.
   * @param {Key} key
   * @returns {boolean} `true` if the value was deleted, `false` otherwise.
   */
  delete(key) {
    const event = new CustomEvent('delete', {
      detail: {
        key,
      },
    });
    this.dispatchEvent(event);
    return this.#map.delete(key);
  }

  /**
   * Returns an iterator for the store.
   * @returns {IterableIterator<[Key, Value]>}
   */
  [Symbol.iterator]() {
    return this.#map[Symbol.iterator]();
  }

  /**
   * Clears the store.
   */
  clear() {
    const event = new CustomEvent('clear');
    this.dispatchEvent(event);
    this.#map.clear();
  }

  /**
   * Returns the number of key-value pairs in the store.
   * @returns {number}
   */
  get size() {
    return this.#map.size;
  }

  /**
   * Returns `true` if the store contains a value for the specified key, `false` otherwise.
   * @param {Key} key
   * @returns {boolean}
   */
  has(key) {
    return this.#map.has(key);
  }

  /**
   * Adds an event listener to the store.
   * @template {ObservableMapEventDetailKey<Key, Value>} EventType
   * @param {EventType} type
   * @param {GetListener<Key, Value,EventType>} listener
   * @param {AddEventListenerOptions | boolean} [options]
   */
  // @ts-ignore
  addEventListener(type, listener, options) {
    super.addEventListener(
      type,
      /** @type {EventListener} */ (listener),
      options
    );
  }

  /**
   * Removes an event listener from the store.
   * @template {ObservableMapEventDetailKey<Key, Value>} EventType
   * @param {EventType} type
   * @param {GetListener<Key, Value,EventType>} listener
   * @param {EventListenerOptions | boolean} [options]
   */
  // @ts-ignore
  removeEventListener(type, listener, options) {
    super.removeEventListener(
      type,
      /** @type {EventListener} */ (listener),
      options
    );
  }
}
