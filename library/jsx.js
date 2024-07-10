import { convertObjectToCssStylesheet } from './utils.js';

const camelCasedAttributes = new Set([
  // SVG attributes
  'attributeName',
  'attributeType',
  'baseFrequency',
  'baseProfile',
  'calcMode',
  'clipPathUnits',
  'diffuseConstant',
  'edgeMode',
  'filterUnits',
  'glyphRef',
  'gradientTransform',
  'gradientUnits',
  'kernelMatrix',
  'kernelUnitLength',
  'keyPoints',
  'keySplines',
  'keyTimes',
  'lengthAdjust',
  'limitingConeAngle',
  'markerHeight',
  'markerUnits',
  'markerWidth',
  'maskContentUnits',
  'maskUnits',
  'numOctaves',
  'pathLength',
  'patternContentUnits',
  'patternTransform',
  'patternUnits',
  'pointsAtX',
  'pointsAtY',
  'pointsAtZ',
  'preserveAlpha',
  'preserveAspectRatio',
  'primitiveUnits',
  'refX',
  'refY',
  'repeatCount',
  'repeatDur',
  'requiredExtensions',
  'requiredFeatures',
  'specularConstant',
  'specularExponent',
  'spreadMethod',
  'startOffset',
  'stdDeviation',
  'stitchTiles',
  'surfaceScale',
  'systemLanguage',
  'tableValues',
  'targetX',
  'targetY',
  'textLength',
  'viewBox',
  'viewTarget',
  'xChannelSelector',
  'yChannelSelector',
  'zoomAndPan',

  // MathML attributes
  'columnAlign',
  'columnLines',
  'columnSpacing',
  'displayStyle',
  'equalColumns',
  'equalRows',
  'frameSpacing',
  'labelSpacing',
  'longdivStyle',
  'maxSize',
  'minSize',
  'movablelimits',
  'rowAlign',
  'rowLines',
  'rowSpacing',
  'scriptLevel',
  'scriptMinSize',
  'scriptSizemultiplier',
  'stackAlign',
  'useHeight',

  // HTML attributes (there are no natively camel cased HTML attributes,
  // but including this comment for completeness)
]);

/**
 * Creates a new DOM element with the specified tag name, props, and children.
 *
 * @template {object} Props
 * @template {string | ((props: Props & { children: any } | typeof DocumentFragment) => Element)} TagName
 * @param {TagName} tagname - The HTML tag name for the element.
 * @param {Props} props - An object containing the element's properties.
 * @param {...*} children - The child elements of the element.
 * @returns {TagName extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[TagName]: Element} A new virtual DOM element.
 */
export function h(tagname, props, ...children) {
  if (Object.is(tagname, DocumentFragment)) {
    const tagname = document.createDocumentFragment();
    for (const child of children) {
      tagname.appendChild(normalizeChild(child));
    }
    //@ts-ignore
    return tagname;
  }

  if (typeof tagname === 'function') {
    // @ts-ignore
    const component = tagname({
      ...props,
    });

    if (component instanceof Element) {
      for (const child of children) {
        component.appendChild(normalizeChild(child));
      }
    }

    //@ts-ignore
    return component;
  }

  const element =
    tagname === 'svg'
      ? document.createElementNS('http://www.w3.org/2000/svg', tagname)
      : tagname === 'math'
      ? document.createElementNS('http://www.w3.org/1998/Math/MathML', tagname)
      : document.createElement(tagname);

  if (props !== null)
    for (const [key, value] of Object.entries(props)) {
      // store element event listeners.
      if (
        key.startsWith('on') &&
        key.length > 2 &&
        key[2].toLowerCase() !== key[2] &&
        typeof value !== 'string'
      ) {
        element.addEventListener(key.slice(2).toLowerCase(), value);
        continue;
      }

      if (key.startsWith('aria')) {
        element.setAttribute(`aria-${key.slice(4).toLowerCase()}`, value);
        continue;
      }

      if (key.startsWith('form')) {
        element.setAttribute(key.toLowerCase(), value);
        continue;
      }

      if (
        key === 'dangerouslySetInnerHTML' &&
        typeof value === 'object' &&
        value !== null &&
        '__html' in value &&
        typeof value.__html === 'string'
      ) {
        element.innerHTML = value.html;
        continue;
      }

      if (key === 'style' && typeof value === 'object' && value !== null) {
        element.setAttribute(
          'style',
          convertObjectToCssStylesheet(value, false)
        );
        continue;
      }

      if (value === undefined) continue;

      if (camelCasedAttributes.has(key)) {
        element.setAttribute(key, value);
        continue;
      }

      element.setAttribute(
        key.replace(/([A-Z])/g, (match) => {
          return `-${match.toLowerCase()}`;
        }),
        value
      );
    }

  for (const child of children) {
    const childNode = normalizeChild(child);
    if (
      childNode instanceof HTMLElement &&
      customElements.get(childNode.tagName.toLowerCase())
    ) {
      element.appendChild(childNode);
      continue;
    }

    if (
      (tagname === 'svg' || tagname === 'math') &&
      childNode instanceof HTMLElement
    ) {
      const temp = document.createElementNS(element.namespaceURI ?? '', 'div');
      temp.innerHTML = childNode.outerHTML;
      element.append(...temp.children);
      continue;
    }

    element.appendChild(childNode);
  }

  // @ts-ignore
  return element;
}

/**
 * Normalizes a child jsx element for use in the DOM.
 * @param {Node | Array<any> | string | number | boolean | undefined | null} child - The child element to normalize.
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

  return document.createTextNode(child?.toString() ?? '');
}

// @ts-ignore
globalThis.__bullet__jsx = h;
// @ts-ignore
globalThis.__bullet__jsxFragment = DocumentFragment;

export default h;
