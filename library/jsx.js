import { BulletComponent, getCurrentElement } from './component.js';
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
 * @template {string | ((props: Props & { children: any } | typeof DocumentFragment) => Node | Promise<Node>)} TagName
 * @param {TagName} tagname - The HTML tag name for the element.
 * @param {Props} props - An object containing the element's properties.
 * @param {...*} children - The child elements of the element.
 * @returns {Node} A new virtual DOM element.
 */
export function h(tagname, props, ...children) {
  if (Object.is(tagname, DocumentFragment)) {
    const tagname = document.createDocumentFragment();
    for (const child of children) {
      tagname.appendChild(normalizeJsxChild(child));
    }
    //@ts-ignore
    return tagname;
  }

  if (typeof tagname === 'function') {
    // @ts-ignore
    const component = tagname({
      children,
      ...props,
    });

    if (component instanceof Promise) {
      const placeholder = document.createComment('---');
      component.then((component) => {
        if (component instanceof BulletComponent) {
          for (const child of children) {
            component.appendChild(normalizeJsxChild(child));
          }
        }
        placeholder.replaceWith(component);
      });
      return placeholder;
    }

    if (component instanceof BulletComponent) {
      for (const child of children) {
        component.appendChild(normalizeJsxChild(child));
      }
    }

    return component;
  }

  /** @type {JsxElement} */ //@ts-ignore
  const element =
    tagname === 'svg'
      ? document.createElementNS('http://www.w3.org/2000/svg', tagname)
      : tagname === 'math'
      ? document.createElementNS('http://www.w3.org/1998/Math/MathML', tagname)
      : document.createElement(tagname);

  element.__eventListenerList = new Map();
  element.__attributeCells = [];

  if (props !== null)
    for (const [key, value] of Object.entries(props)) {
      if (
        typeof value === 'object' &&
        'runAndListen' in value &&
        typeof value.runAndListen === 'function'
      ) {
        /** @param {any} value */
        const callback = (value) => {
          setJsxAttribute(element, key, value);
        };
        const signal = getCurrentElement()?.controller?.signal;
        value.runAndListen(callback, { signal, weak: true });
        element.__attributeCells.push([value, callback]);
      } else {
        setJsxAttribute(element, key, value);
      }
    }

  for (const child of children) {
    const childNode = normalizeJsxChild(child);
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
export function setJsxAttribute(element, key, value) {
  // store element event listeners.
  if (
    key.startsWith('on') &&
    key.length > 2 &&
    key[2].toLowerCase() !== key[2] &&
    typeof value !== 'string'
  ) {
    const eventName = /** @type {keyof ElementEventMap} */ (
      key.slice(2).toLowerCase()
    );
    // remove stale listeners
    element.removeEventListener(eventName, value);
    const oldValue = element.__eventListenerList.get(eventName);
    if (oldValue !== undefined && oldValue !== value) {
      element.removeEventListener(eventName, oldValue);
      element.__eventListenerList.delete(eventName);
    }

    if (typeof value === 'function') {
      element.addEventListener(eventName, value);
      element.__eventListenerList.set(eventName, value);
      return;
    }

    return;
  }

  if (key === 'children') {
    return;
  }

  if (key.startsWith('aria')) {
    const ariaKey = `aria-${key.slice(4).toLowerCase()}`;

    if (isSomewhatFalsy(value)) {
      element.removeAttribute(ariaKey);
    } else {
      element.setAttribute(ariaKey, value);
    }
    return;
  }

  if (key.startsWith('form') || key.startsWith('popover')) {
    const attrKey = key.toLowerCase();

    if (isSomewhatFalsy(value)) {
      element.removeAttribute(attrKey);
    } else {
      element.setAttribute(attrKey, value);
    }

    return;
  }

  if (
    key === 'dangerouslySetInnerHTML' &&
    typeof value === 'object' &&
    value !== null &&
    '__html' in value &&
    typeof value.__html === 'string'
  ) {
    element.innerHTML = value.html;
    return;
  }

  if (key === 'style' && typeof value === 'object' && value !== null) {
    element.setAttribute('style', convertObjectToCssStylesheet(value, false));
    return;
  }

  if (camelCasedAttributes.has(key)) {
    if (isSomewhatFalsy(value)) {
      element.removeAttribute(key);
    } else {
      element.setAttribute(key, value);
    }
    return;
  }

  const attributeName = key.replace(/([A-Z])/g, (match) => {
    return `-${match.toLowerCase()}`;
  });

  if (attributeName === 'className') {
    element.className = value;
    return;
  }

  if (isSomewhatFalsy(value)) {
    element.removeAttribute(key);
  } else {
    element.setAttribute(attributeName, value);
  }
}

/**
 * @template T
 * Checks if a value is somewhat falsy.
 * @param {T} value
 * @returns {value is undefined | null | false}
 */
function isSomewhatFalsy(value) {
  return value === undefined || value === null || value === false;
}

/**
 * Normalizes a child jsx element for use in the DOM.
 * @param {Node | Array<any> | string | number | boolean | undefined | null} child - The child element to normalize.
 * @returns {Node} The normalized child element.
 */
export function normalizeJsxChild(child) {
  if (child instanceof Node) {
    return child;
  }

  if (Array.isArray(child)) {
    const fragment = document.createDocumentFragment();

    for (const element of child) {
      fragment.appendChild(normalizeJsxChild(element));
    }

    return fragment;
  }

  if (child === null || child === undefined) {
    return document.createTextNode('');
  }

  return document.createTextNode(child?.toString() ?? '');
}

export default h;
