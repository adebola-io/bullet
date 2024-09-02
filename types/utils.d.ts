/**
 * Converts an object of styles to a CSS stylesheet string.
 *
 * @param {Partial<CSSStyleDeclaration>} styles - An object where the keys are CSS property names and the values are CSS property values.
 * @param {boolean} [useHost] - Whether to include the `:host` selector in the stylesheet.
 * @param {any} [element] The target element, if any.
 * @returns {string} A CSS stylesheet string that can be applied as a style to an HTML element.
 */
export function convertObjectToCssStylesheet(styles: Partial<CSSStyleDeclaration>, useHost?: boolean | undefined, element?: any): string;
/**
 * Converts a string to kebab-case.
 * @param {string} str - The input string to convert.
 * @returns {string} The input string converted to kebab-case.
 */
export function toKebabCase(str: string): string;
/**
 * Generates an array of DOM nodes from a given input.
 * @param {import('./component.js').Template | TemplateStringsArray} children - The input to generate DOM nodes from.
 * @returns {Node[]}
 */
export function generateChildNodes(children: import("./component.js").Template | TemplateStringsArray): Node[];
/**
 * Generates an object containing the attributes of a given DOM element.
 *
 * @param {Element} element - The DOM element to extract attributes from.
 * @returns {Record<string, string>} An object where the keys are the attribute names and the values are the attribute values.
 */
export function getElementAttributes(element: Element): Record<string, string>;
/**
 * @template {Element} T
 * Replaces component placeholders in the given element with their corresponding instances.
 *
 * @param {T} element - The element containing the component placeholders.
 * @returns {T}
 */
export function replaceComponentPlaceholders<T extends Element>(element: T): T;
/**
 * Generates a unique key for a custom element instance.
 *
 * @param {string} elementIdentifier - A unique identifier for the custom element.
 * @returns {string} A unique key for the custom element instance.
 */
export function generateInstanceKey(elementIdentifier: string): string;
/**
 * Generates a unique tag name for a component.
 * @returns {string}
 */
export function generateComponentName(): string;
/**
 * Checks if the given value is not an object.
 *
 * @param {any} value - The value to check.
 * @returns {boolean} `true` if the value is not an object, `false` otherwise.
 */
export function isNotObject(value: any): boolean;
/** @type {Array<any>} */
export const RENDERING_TREE: Array<any>;
export function getCurrentElement(): import("./component.js").BulletElement<unknown> | undefined;
export class BulletComponent extends HTMLElement {
    /** @type {() => import('./component.js').Template} */ render: () => import("./component.js").Template;
}
