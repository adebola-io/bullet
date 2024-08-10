/**
 * Creates a new DOM element with the specified tag name, props, and children.
 *
 * @template {object} Props
 * @template {string | ((props: Props & { children: any } | typeof DocumentFragment) => Node | Promise<Node>)} TagName
 * @param {TagName} tagname - The HTML tag name for the element.
 * @param {Props} props - An object containing the element's properties.
 * @param {...*} children - The child elements of the element.
 * @returns {Node} A new virtual DOM element.
 */
export function h<Props extends object, TagName extends string | ((props: (Props & {
    children: any;
}) | typeof DocumentFragment) => Node | Promise<Node>)>(tagname: TagName, props: Props, ...children: any[]): Node;
/**
 * @typedef JsxElementProperties
 * @property {Map<string, () => void>} __eventListenerList
 * List of event listeners set as attributes on the element.
 * @property {Array<[object, (value: any) => void]>} __attributeCells
 * List of cell callbacks set as attributes on the element.
 */
/**
 * @typedef {Element & JsxElementProperties} JsxElement
 *
 */
/**
 * Sets an attribute on an element.
 * @param {JsxElement} element - The element to set the attribute on.
 * @param {string} key - The name of the attribute.
 * @param {any} value - The value of the attribute.
 */
export function setJsxAttribute(element: JsxElement, key: string, value: any): void;
/**
 * Normalizes a child jsx element for use in the DOM.
 * @param {Node | Array<any> | string | number | boolean | undefined | null} child - The child element to normalize.
 * @returns {Node} The normalized child element.
 */
export function normalizeJsxChild(child: Node | Array<any> | string | number | boolean | undefined | null): Node;
export default h;
export type JsxElementProperties = {
    /**
     * List of event listeners set as attributes on the element.
     */
    __eventListenerList: Map<string, () => void>;
    /**
     * List of cell callbacks set as attributes on the element.
     */
    __attributeCells: Array<[object, (value: any) => void]>;
};
export type JsxElement = Element & JsxElementProperties;
