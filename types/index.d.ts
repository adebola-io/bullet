/**
 * @typedef {import('./component.js').Template} Template
 */
/**
 * Creates a mapping of an iterator to DOM nodes.
 *
 * @template {Iterable<any>} U
 * @param {Cell<U> | U} list
 * @param {(item: U extends Iterable<infer V> ? V : never, index: Cell<number>, iter: U) => Template} fn
 * @returns {Template}
 *
 * @example
 * // Create a list of names
 * const names = Cell.source(['Alice', 'Bob', 'Charlie']);
 *
 * // Use rFor to create a list of <li> elements
 * const listItems = For(names, (name) => {
 *   const li = document.createElement('li');
 *   li.textContent = name;
 *   return li;
 * });
 *
 * // Append the list items to a <ul> element
 * const ul = document.createElement('ul');
 * ul.append(...listItems);
 * document.body.appendChild(ul);
 */
export function For<U extends Iterable<any>>(list: Cell<U> | U, fn: (item: U extends Iterable<infer V> ? V : never, index: Cell<number>, iter: U) => Template): Template;
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
export function If<T>(value: T | Cell<T>, fn: (value: NonNullable<T>) => Template, elseFn?: (() => Template) | undefined): Template;
export * from "./component.js";
export * from "./router/index.js";
export * as jsx from "./jsx.js";
export * as helpers from "./helpers/index.js";
export type Template = import("./component.js").Template;
import { Cell } from '@adbl/cells';
