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
export { setWindowContext, getWindowContext } from "./shim.js";
