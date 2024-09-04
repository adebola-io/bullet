/// @adbl-bullet

export * from './component.js';
export * from './router/index.js';
export * as jsx from './jsx.js';
export * as helpers from './helpers/index.js';

import { generateChildNodes } from './utils.js';
import { Cell, SourceCell } from '@adbl/cells';

/**
 * @typedef {import('./component.js').Template} Template
 */

/**
 * Creates a dynamic mapping of an iterable to DOM nodes, efficiently updating when the iterable changes.
 *
 * @template {Iterable<any>} U
 * @param {Cell<U> | U} list - The iterable or Cell containing an iterable to map over
 * @param {(item: U extends Iterable<infer V> ? V : never, index: Cell<number>, iter: U) => Template} fn - Function to create a Template for each item
 * @returns {Template} - A Template representing the mapped items
 *
 * @example
 * // Create a reactive list of names
 * const names = Cell.source(['Alice', 'Bob', 'Charlie']);
 *
 * // Use For to create a dynamic list of <li> elements
 * const listItems = For(names, (name, index) => {
 *   const li = document.createElement('li');
 *   li.textContent = `${index.value + 1}. ${name}`;
 *   return li;
 * });
 *
 * // Append the list items to a <ul> element
 * const ul = document.createElement('ul');
 * ul.append(...listItems);
 * document.body.appendChild(ul);
 *
 * // Later, update the names
 * names.value = [...names.value, 'David'];
 * // The list will automatically update to include the new name
 */
export function For(list, fn) {
  /**
   * @type Node[]}
   */
  let snapshot = [];

  if (Cell.isCell(list)) {
    const rangeStart = document.createComment('----');
    const rangeEnd = document.createComment('----');
    const uniqueSymbolMarker = Symbol();
    /**
     * @type Map<any, {
     *  index: Cell<number>,
     *  nodes: Node[]
     * }>
     */
    let nodeStore = new Map();

    /**
     * @param {U} _list
     */
    const callback = (_list) => {
      /**
       * @type Node[]
       */
      const newSnapShot = [];
      const newNodeStore = new Map();

      let index = 0;
      for (const item of _list) {
        let itemKey;
        /**
         * @type {any}
         */
        const itemAsAny = item;
        const itemIsObjectLike =
          itemAsAny && /^(object|function|symbol)$/.test(typeof itemAsAny);

        if (itemIsObjectLike) {
          itemKey = itemAsAny[uniqueSymbolMarker];
        } else {
          itemKey = item?.toString ? `${item.toString()}.${index}` : index;
        }

        if (itemKey === undefined) {
          itemKey = Symbol();
          itemAsAny[uniqueSymbolMarker] = itemKey;
        }

        const cachedResult = nodeStore.get(itemKey);
        if (cachedResult === undefined) {
          const i = Cell.source(index);
          const newNodes = generateChildNodes(fn(item, i, _list));
          newNodeStore.set(itemKey, {
            nodes: newNodes,
            index: i,
          });
          newSnapShot.push(...newNodes);
        } else {
          /**
           * @type {SourceCell<number>}
           */
          (cachedResult.index).value = index;
          newNodeStore.set(itemKey, cachedResult);
          newSnapShot.push(...cachedResult.nodes);
        }
        index++;
      }

      nodeStore = newNodeStore;

      /** @type {ChildNode} */
      let currentNode = rangeStart;
      let oldIndex = 0;
      let newIndex = 0;

      while (
        newIndex < newSnapShot.length ||
        (currentNode.nextSibling && currentNode.nextSibling !== rangeEnd)
      ) {
        const newNode = /** @type {ChildNode} */ (newSnapShot[newIndex]);
        let oldNode = currentNode.nextSibling;

        if (!oldNode || oldNode === rangeEnd) {
          // Append remaining new nodes
          currentNode.after(...newSnapShot.slice(newIndex));
          break;
        }

        if (newIndex >= newSnapShot.length) {
          // Remove remaining old nodes
          while (oldNode && oldNode !== rangeEnd) {
            /** @type {ChildNode | null} */
            const nextOldNode = oldNode.nextSibling;
            oldNode.remove();
            oldNode = nextOldNode;
          }
          break;
        }

        if (oldNode === newNode) {
          // Node hasn't changed, move to next
          currentNode = oldNode;
          newIndex++;
          oldIndex++;
        } else {
          // Check if the new node exists later in the old list
          let futureOldNode = oldNode.nextSibling;
          let foundMatch = false;
          while (futureOldNode && futureOldNode !== rangeEnd) {
            if (futureOldNode === newNode) {
              // Remove skipped old nodes
              while (oldNode && oldNode !== futureOldNode) {
                const nextOldNode = /** @type {ChildNode} */ (
                  oldNode.nextSibling
                );
                oldNode?.remove();
                oldNode = nextOldNode;
              }
              currentNode = futureOldNode;
              newIndex++;
              oldIndex = newIndex;
              foundMatch = true;
              break;
            }
            futureOldNode = futureOldNode.nextSibling;
          }

          if (!foundMatch) {
            // Insert new node
            oldNode.before(newNode);
            currentNode = newNode;
            newIndex++;
          }
        }
      }

      snapshot = newSnapShot;
    };

    Reflect.set(rangeStart, '__bullet_persisted', callback);

    list.runAndListen(callback, { weak: true });
    return [rangeStart, ...snapshot, rangeEnd];
  }

  let index = 0;
  for (const item of list) {
    snapshot.push(...generateChildNodes(fn(item, Cell.source(index), list)));
    index += 1;
  }
  return snapshot;
}

/**
 * Conditionally renders nodes based on the truthiness of a value.
 *
 * @template T
 * @param {T | Cell<T>} value
 * @param {(value: NonNullable<T>) => Template} fn
 * @param {() => Template} [elseFn] - Optional callback for falsy values
 * @returns {Template}
 *
 * @example
 * import { Cell } from '@adbl/cells';
 * // Create a reactive cell with a boolean value
 * const isLoggedIn = Cell.source(false);
 *
 * // Use renderIf to conditionally render a welcome message
 * const welcomeMessage = If(
 *  isLoggedIn,
 *  () => {
 *    const div = document.createElement('div');
 *    div.textContent = 'Welcome, user!';
 *    return div;
 *  },
 * () => {
 *    const div = document.createElement('div');
 *    div.textContent = 'Please log in.';
 *    return div;
 * });
 *
 * // Add the result to the DOM
 * document.body.append(...welcomeMessage);
 *
 * // Later, when the user logs in, update the cell
 * isLoggedIn.value = true;
 * // The welcome message will now be displayed
 */
export function If(value, fn, elseFn) {
  /** @type {Node[]} */
  let nodes = [];

  if (Cell.isCell(value)) {
    const rangeStart = document.createComment('----');
    const rangeEnd = document.createComment('----');

    /** @param {T} value */
    const callback = (value) => {
      let nextNode = rangeStart.nextSibling;
      while (nextNode && nextNode !== rangeEnd) {
        nextNode.remove();
        nextNode = rangeStart.nextSibling;
      }

      if (value) {
        nodes = generateChildNodes(fn(value));
      } else if (elseFn) {
        nodes = generateChildNodes(elseFn());
      } else {
        nodes = [];
      }
      rangeStart.after(...nodes);
    };

    Reflect.set(rangeStart, '__bullet_persisted', callback); // prevents garbage collection.

    value.runAndListen(callback, { weak: true });
    return [rangeStart, ...nodes, rangeEnd];
  }

  if (value) {
    return fn(value);
  }

  if (elseFn) {
    return elseFn();
  }
}
