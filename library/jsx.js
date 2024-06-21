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
export function h(tagname, props, ...children) {
  if (typeof tagname === 'function') {
    // @ts-ignore
    return tagname({
      ...props,
      children,
    });
  }

  const element = document.createElement(tagname);

  if (props !== null)
    for (const [key, value] of Object.entries(props)) {
      element.setAttribute(key, value);
    }

  for (const child of children) {
    element.appendChild(normalizeChild(child));
  }

  // @ts-ignore
  return element;
}

/**
 * Renders a document fragment from the provided fragment object.
 *
 * @param {{ children: any }} fragment - The fragment object to render.
 * @returns {DocumentFragment} The rendered document fragment.
 */
export function renderFragment(fragment) {
  const childNodes = fragment.children.map(normalizeChild);
  const fragmentNode = document.createDocumentFragment();
  for (const child of childNodes) {
    fragmentNode.appendChild(child);
  }
  return fragmentNode;
}

/**
 * Normalizes a child jsx element for use in the DOM.
 * @param {Node | Array<any> | string | number | boolean} child - The child element to normalize.
 * @returns {Node} The normalized child element.
 */
export function normalizeChild(child) {
  if (child instanceof Node) {
    return child;
  }

  if (Array.isArray(child)) {
    const fragment = document.createDocumentFragment();

    for (const element of child) {
      fragment.appendChild(normalizeChild(element));
    }

    return fragment;
  }

  return document.createTextNode(child.toString());
}

// @ts-ignore
window.__aim__jsx = h;
// @ts-ignore
window.__aim__jsxFragment = renderFragment;

export default h;
