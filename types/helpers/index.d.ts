/**
 * Asynchronously fetches and inlines an SVG icon using its URL.
 * @param {SvgProps} props
 * @returns {Promise<Element>} The SVG element created, or an empty template if the request fails.
 */
export function InlineSvg(props: SvgProps): Promise<Element>;
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
export class ObservableMap<Key, Value> extends EventTarget {
    constructor();
    /**
     * Sets a value in the store.
     * @param {Key} key
     * @param {Value} value
     */
    set(key: Key, value: Value): void;
    /**
     * Gets a value from the store.
     * @param {Key} key
     * @returns {Value | undefined}
     */
    get(key: Key): Value | undefined;
    /**
     * Deletes a value from the store.
     * @param {Key} key
     * @returns {boolean} `true` if the value was deleted, `false` otherwise.
     */
    delete(key: Key): boolean;
    /**
     * Clears the store.
     */
    clear(): void;
    /**
     * Returns the number of key-value pairs in the store.
     * @returns {number}
     */
    get size(): number;
    /**
     * Returns `true` if the store contains a value for the specified key, `false` otherwise.
     * @param {Key} key
     * @returns {boolean}
     */
    has(key: Key): boolean;
    /**
     * Adds an event listener to the store.
     * @template {ObservableMapEventDetailKey<Key, Value>} EventType
     * @param {EventType} type
     * @param {GetListener<Key, Value,EventType>} listener
     * @param {AddEventListenerOptions | boolean} [options]
     */
    addEventListener<EventType extends ObservableMapEventDetailKey<Key, Value>>(type: EventType, listener: GetListener<Key, Value, EventType>, options?: boolean | AddEventListenerOptions | undefined): void;
    /**
     * Removes an event listener from the store.
     * @template {ObservableMapEventDetailKey<Key, Value>} EventType
     * @param {EventType} type
     * @param {GetListener<Key, Value,EventType>} listener
     * @param {EventListenerOptions | boolean} [options]
     */
    removeEventListener<EventType extends ObservableMapEventDetailKey<Key, Value>>(type: EventType, listener: GetListener<Key, Value, EventType>, options?: boolean | EventListenerOptions | undefined): void;
    /**
     * Returns an iterator for the store.
     * @returns {IterableIterator<[Key, Value]>}
     */
    [Symbol.iterator](): IterableIterator<[Key, Value]>;
    #private;
}
export type ObservableMapEventDetailMap<Key, Value> = {
    set: {
        key: Key;
        value: Value;
    };
    get: {
        key: Key;
    };
    delete: {
        key: Key;
    };
    clear: {
        key: Key;
    };
};
export type ObservableMapEventDetailKey<Key, Value> = keyof ObservableMapEventDetailMap<Key, Value>;
export type GetListener<Key, Value, EventType extends ObservableMapEventDetailKey<Key, Value>> = (event: CustomEvent<ObservableMapEventDetailMap<Key, Value>[EventType]>) => void;
export type InlineSvgProps = {
    /**
     * address of the svg icon to inline.
     */
    href: string;
};
export type SvgProps = InlineSvgProps & JSX.IntrinsicElements["svg"];
