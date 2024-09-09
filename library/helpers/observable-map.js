// @bullet-resolve-ignore

import { getWindowContext } from '../shim.js';

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
export class ObservableMap {
  #map = new Map();

  constructor() {
    const window = getWindowContext();
    this.target = new window.EventTarget();
  }

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
    this.target.dispatchEvent(event);
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
    this.target.dispatchEvent(event);
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
    this.target.dispatchEvent(event);
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
    this.target.dispatchEvent(event);
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
    this.target.addEventListener(
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
    this.target.removeEventListener(
      type,
      /** @type {EventListener} */ (listener),
      options
    );
  }
}
