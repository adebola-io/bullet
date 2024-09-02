/// @adbl-bullet
import { CUSTOM_ELEMENT_INSTANCE_CACHE } from './constants.js';
import { Cell } from '@adbl/cells';

/**
 * Converts an object of styles to a CSS stylesheet string.
 *
 * @param {Partial<CSSStyleDeclaration>} styles - An object where the keys are CSS property names and the values are CSS property values.
 * @param {boolean} [useHost] - Whether to include the `:host` selector in the stylesheet.
 * @param {any} [element] The target element, if any.
 * @returns {string} A CSS stylesheet string that can be applied as a style to an HTML element.
 */
export function convertObjectToCssStylesheet(styles, useHost, element) {
  return `${useHost ? ':host{' : ''}${Object.entries(styles)
    .map(([key, value]) => {
      if (Cell.isCell(/** @type any */ (value)) && element) {
        /** @param {any} innerValue */
        const callback = (innerValue) => {
          const stylePropertyKey = key.startsWith('--')
            ? key
            : toKebabCase(key);

          if (innerValue) {
            element.style.setProperty(stylePropertyKey, innerValue);
          } else {
            element.style.removeProperty(stylePropertyKey);
          }
        };

        if (!Reflect.has(element, 'bullet__attributeCells')) {
          Reflect.set(element, 'bullet__attributeCells', new Set());
        }
        Reflect.set(element, 'bullet__attributeCells', new Set());
        element.bullet__attributeCells.add(callback);
        element.bullet__attributeCells.add(value);

        value.listen(callback, { weak: true });
      }
      if (!value) return '';
      return `${
        key.startsWith('--') ? key : toKebabCase(key)
      }: ${value.valueOf()}`;
    })
    .join('; ')}${useHost ? '}' : ''}`;
}

/**
 * Converts a string to kebab-case.
 * @param {string} str - The input string to convert.
 * @returns {string} The input string converted to kebab-case.
 */
export function toKebabCase(str) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

/**
 * Generates an array of DOM nodes from a given input.
 * @param {import('./component.js').Template | TemplateStringsArray} children - The input to generate DOM nodes from.
 * @returns {Node[]}
 */
export function generateChildNodes(children) {
  /** @type {Node[]} */
  const nodes = [];

  if (typeof children === 'string') {
    const parser = new DOMParser();
    return Array.from(
      parser.parseFromString(children, 'text/html').body.childNodes
    );
  }

  if (children instanceof DocumentFragment) {
    return Array.from(children.childNodes);
  }

  if (children instanceof Node) {
    return [children];
  }

  if (Array.isArray(children)) {
    return children.flatMap((child) => generateChildNodes(child));
  }

  return nodes;
}

/**
 * Generates an object containing the attributes of a given DOM element.
 *
 * @param {Element} element - The DOM element to extract attributes from.
 * @returns {Record<string, string>} An object where the keys are the attribute names and the values are the attribute values.
 */
export function getElementAttributes(element) {
  /** @type {Record<string, string>} */
  const attributes = {};
  for (const attribute of Array.from(element.attributes)) {
    attributes[attribute.name] = attribute.value;
  }
  return attributes;
}

/**
 * @template {Element} T
 * Replaces component placeholders in the given element with their corresponding instances.
 *
 * @param {T} element - The element containing the component placeholders.
 * @returns {T}
 */
export function replaceComponentPlaceholders(element) {
  // Find all the component placeholders in the element's shadow root.
  const placeholders = element.shadowRoot?.querySelectorAll(
    'template[aim-placeholder]'
  );

  // Replace each placeholder with its corresponding component instance.
  for (const placeholder of Array.from(placeholders ?? [])) {
    // Get the key of the placeholder.
    const componentInstanceKey = placeholder.getAttribute('key');
    if (!componentInstanceKey) continue;

    // Get the component instance corresponding to the key from the cache.
    const componentInstance =
      CUSTOM_ELEMENT_INSTANCE_CACHE.get(componentInstanceKey);
    if (!componentInstance) continue;

    // Replace the placeholder with the component instance.
    placeholder.replaceWith(componentInstance);

    // Remove the component instance from the cache.
    CUSTOM_ELEMENT_INSTANCE_CACHE.delete(componentInstanceKey);
  }

  return element;
}

// /**
//  * Replaces event listeners on the given node with the corresponding listeners from the provided data.
//  *
//  * @param {Node} node - The DOM element to replace event listeners on.
//  * @param {Element } parent - The parent component instance.
//  */
// export function replaceEventListeners(node, parent) {
//   if (!(node instanceof Element)) return;

//   const attributes = Array.from(node.attributes).filter((attribute) =>
//     attribute.name.startsWith('on')
//   );

//   for (const attribute of attributes) {
//     const eventName = attribute.name.slice(2);
//     const [namespaceKey, listenerKey] = attribute.value.split('@');

//     const namespace = GLOBAL_DATA.get(namespaceKey);
//     const listener = namespace?.get(listenerKey);
//     const listenerOwner = namespace?.get('owner');

//     if (listener && !customElements.get(node.tagName.toLowerCase())) {
//       node.addEventListener(eventName, listener.bind(listenerOwner));
//       node.removeAttribute(attribute.name);
//     }
//   }

//   for (const child of Array.from(node.children)) {
//     replaceEventListeners(child, parent);
//   }
// }

/**
 * Generates a unique key for a custom element instance.
 *
 * @param {string} elementIdentifier - A unique identifier for the custom element.
 * @returns {string} A unique key for the custom element instance.
 */
export function generateInstanceKey(elementIdentifier) {
  let key = `${elementIdentifier}-${Math.random().toString(36).slice(2)}`;
  while (CUSTOM_ELEMENT_INSTANCE_CACHE.has(key)) {
    key = `${elementIdentifier}-${Math.random().toString(36).slice(2)}`;
  }
  return key;
}

/**
 * Generates a unique tag name for a component.
 * @returns {string}
 */
export function generateComponentName() {
  let componentName = `bt-${Math.random().toString(36).slice(2, 10)}`;
  while (customElements.get(componentName)) {
    componentName = `bt-${Math.random().toString(36).slice(2, 10)}`;
  }
  return componentName;
}

/**
 * Checks if the given value is not an object.
 *
 * @param {any} value - The value to check.
 * @returns {boolean} `true` if the value is not an object, `false` otherwise.
 */
export function isNotObject(value) {
  return (
    !value.toString || !/function|object/.test(typeof value) || value === null
  );
}

/** @type {Array<any>} */
export const RENDERING_TREE = [];

/**
 * Returns the last element in the rendering tree, if it is a `BulletElement`.
 * @returns {import('./component.js').BulletElement<unknown> | undefined} The last element in the rendering tree, or `undefined` if it is not a `BulletElement`.
 */
export const getCurrentElement = () => {
  return RENDERING_TREE[RENDERING_TREE.length - 1];
};

export class BulletComponent extends HTMLElement {
  /** @type {() => import('./component.js').Template} */ //@ts-ignore
  render;
}
