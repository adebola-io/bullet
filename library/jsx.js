// @bullet-resolve-ignore
import { Cell } from '@adbl/cells';
import {
  convertObjectToCssStylesheet,
  BulletComponent,
  getCurrentElement,
} from './utils.js';
import { getWindowContext } from './shim.js';

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
 * @template {Record<PropertyKey, any>} Props
 * @template {string | ((props: Props & { children: any } | typeof DocumentFragment, context: any) => Node | Promise<Node>)} TagName
 * @param {TagName} tagname - The HTML tag name for the element.
 * @param {Props} props - An object containing the element's properties.
 * @param {...*} children - The child elements of the element.
 * @returns {Node} A new virtual DOM element.
 */
export function h(tagname, props, ...children) {
  const window = getWindowContext();
  if (Object.is(tagname, window.DocumentFragment)) {
    const tagname = window.document.createDocumentFragment();
    for (const child of children) {
      tagname.appendChild(normalizeJsxChild(child, tagname));
    }
    //@ts-ignore
    return tagname;
  }

  if (typeof tagname === 'function') {
    // @ts-ignore
    const component = tagname(
      {
        children,
        ...props,
      },
      { createdByJsx: true }
    );

    if (component instanceof Promise) {
      const placeholder = window.document.createComment('---');
      component.then((component) => {
        if (component instanceof BulletComponent) {
          for (const child of children) {
            component.appendChild(normalizeJsxChild(child, component));
          }
        }
        placeholder.replaceWith(component);
      });
      return placeholder;
    }

    if (component instanceof BulletComponent) {
      for (const child of children) {
        component.appendChild(normalizeJsxChild(child, component));
      }
    }

    return component;
  }

  const defaultNamespace = props?.xmlns ?? 'http://www.w3.org/1999/xhtml';

  /** @type {JsxElement} */ //@ts-ignore
  const element =
    tagname === 'svg'
      ? window.document.createElementNS('http://www.w3.org/2000/svg', tagname)
      : tagname === 'math'
      ? window.document.createElementNS(
          'http://www.w3.org/1998/Math/MathML',
          tagname
        )
      : window.document.createElementNS(defaultNamespace, tagname);

  element.bullet__eventListenerList = new Map();
  element.bullet__attributeCells = new Set();
  element.bullet__createdByJsx = true;

  if (props !== null)
    for (const [key, value] of Object.entries(props)) {
      setAttributeFromProps(element, key, value);
    }

  for (const child of children) {
    const childNode = normalizeJsxChild(child, element);
    if (
      childNode instanceof window.HTMLElement &&
      window.customElements.get(childNode.tagName.toLowerCase())
    ) {
      element.appendChild(childNode);
      continue;
    }

    if (
      (tagname === 'svg' || tagname === 'math') &&
      childNode instanceof window.HTMLElement
    ) {
      const temp = window.document.createElementNS(
        element.namespaceURI ?? '',
        'div'
      );
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
 * @typedef HiddenElementProperties
 * @property {Map<string, () => void>} bullet__eventListenerList
 * List of event listeners set as attributes on the element.
 * @property {Set<object | ((value: any) => void)>} bullet__attributeCells
 * List of cell callbacks set as attributes on the element.
 * @property {boolean} bullet__createdByJsx
 * Whether or not the element was created using JSX syntax.
 * @property {string | boolean | number | undefined} bullet__key
 * Unique key for the element.
 * @property {object} bullet__finalProps
 * Props passed to the element.
 */

/**
 * @typedef {Element & HiddenElementProperties} JsxElement
 *
 */

/**
 * Sets an attribute on an element based on the provided props.
 *
 * @param {JsxElement} element - The DOM element to set the attribute on.
 * @param {string} key - The name of the attribute to set.
 * @param {any} value - The value to set for the attribute. Can be a primitive value or an object with a `runAndListen` method.
 *
 * @description
 * If the value is an object with a `runAndListen` method, it sets up a reactive attribute.
 * Otherwise, it directly sets the attribute on the element.
 */
export function setAttributeFromProps(element, key, value) {
  const window = getWindowContext();
  if (Cell.isCell(value)) {
    let firstRunComplete = false;
    /** @param {any} value */
    const callback = (value) => {
      if (key === 'key' && firstRunComplete) {
        if (element instanceof BulletComponent) {
          // @ts-ignore
          element.render(element.bullet__finalProps);
        }
      }
      setAttribute(element, key, value);
      firstRunComplete = true;
    };
    let signal;
    if (
      'controller' in element &&
      element.controller instanceof window.AbortController
    ) {
      signal = element.controller.signal;
    } else {
      signal = getCurrentElement()?.controller?.signal;
    }
    value.runAndListen(callback, { signal, weak: true });
    element.bullet__attributeCells.add(callback);
    element.bullet__attributeCells.add(value);
  } else {
    setAttribute(element, key, value);
  }
}

/**
 * Sets an attribute on an element.
 * @param {JsxElement} element - The element to set the attribute on.
 * @param {string} key - The name of the attribute.
 * @param {any} value - The value of the attribute.
 */
export function setAttribute(element, key, value) {
  const createdByJsx = element.bullet__createdByJsx;
  // store element event listeners.
  if (
    key.startsWith('on') &&
    key.length > 2 &&
    (!createdByJsx || (createdByJsx && typeof value !== 'string'))
  ) {
    if (createdByJsx && key[2].toLowerCase() === key[2]) {
      return;
    }
    const eventName = /** @type {keyof ElementEventMap} */ (
      key.slice(2).toLowerCase()
    );
    // remove stale listeners
    element.removeEventListener(eventName, value);
    const oldValue = element.bullet__eventListenerList.get(eventName);
    if (oldValue !== undefined && oldValue !== value) {
      element.removeEventListener(eventName, oldValue);
      element.bullet__eventListenerList.delete(eventName);
    }

    if (typeof value === 'function') {
      setTimeout(() => {
        element.addEventListener(eventName, value);
        element.bullet__eventListenerList.set(eventName, value);
      }, 0);
      return;
    }

    return;
  }

  if (!createdByJsx) {
    if (isSomewhatFalsy(value)) {
      element.removeAttribute(key);
    } else {
      element.setAttribute(key, value);
    }
    return;
  }

  if (key === 'children' && createdByJsx) {
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

  if (
    key.startsWith('form') ||
    key.startsWith('popover') ||
    key.startsWith('auto') ||
    key === 'tabIndex'
  ) {
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
    element.setAttribute(
      'style',
      convertObjectToCssStylesheet(value, false, element)
    );
    return;
  }

  if (key === 'key') {
    element.bullet__key = value;
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

  if (attributeName === 'class-name' || attributeName === 'class') {
    if (typeof value === 'string') {
      element.setAttribute('class', value);
    } else if (Array.isArray(value)) {
      element.setAttribute('class', value.join(' '));
    }
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
 * @param {Node | Array<any> | string | number | boolean | object | undefined | null} child - The child element to normalize.
 * @param {Node} [_parent] - The parent node of the child.
 * @returns {Node} The normalized child element.
 */
export function normalizeJsxChild(child, _parent) {
  const window = getWindowContext();
  if (child instanceof window.Node) {
    return child;
  }

  if (Array.isArray(child)) {
    const fragment = window.document.createDocumentFragment();

    for (const element of child) {
      fragment.appendChild(normalizeJsxChild(element, fragment));
    }

    return fragment;
  }

  if (child === null || child === undefined) {
    return document.createTextNode('');
  }

  // @ts-ignore
  if (Cell.isCell(child)) {
    const textNode = window.document.createTextNode('');
    /** @param {any} value */
    const callback = (value) => {
      textNode.textContent = value;
    };
    child.runAndListen(callback, { weak: true });

    // Persists the references to the value and the callback so they don't get garbage collected.
    if (!Reflect.has(textNode, 'bullet__attributeCells')) {
      Reflect.set(textNode, 'bullet__attributeCells', new Set());
    }
    const cells = Reflect.get(textNode, 'bullet__attributeCells');

    if (cells) {
      cells.add(callback);
      cells.add(child);
    }
    return textNode;
  }

  return window.document.createTextNode(child?.toString() ?? '');
}

export default h;
