/**
 * Creates a new DOM element with the specified tag name, props, and children.
 *
 * @template {object} Props
 * @template {string | ((props: Props & { children: any }) => Element)} TagName
 * @param {TagName} tagname - The HTML tag name for the element.
 * @param {Props} props - An object containing the element's properties.
 * @param {...*} children - The child elements of the element.
 * @returns {TagName extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[TagName]: Element} A new virtual DOM element.
 */
export function h<Props extends object, TagName extends string | ((props: Props & {
    children: any;
}) => Element)>(tagname: TagName, props: Props, ...children: any[]): TagName extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[TagName] : Element;
/**
 * Renders a document fragment from the provided fragment object.
 *
 * @param {{ children: any }} fragment - The fragment object to render.
 * @returns {DocumentFragment} The rendered document fragment.
 */
export function renderFragment(fragment: {
    children: any;
}): DocumentFragment;
/**
 * Normalizes a child jsx element for use in the DOM.
 * @param {Node | Array<any> | string | number | boolean | undefined | null} child - The child element to normalize.
 * @returns {Node} The normalized child element.
 */
export function normalizeChild(child: Node | Array<any> | string | number | boolean | undefined | null): Node;
export default h;
