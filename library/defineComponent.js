/**
 * @typedef {Element | DocumentFragment | string  } AimRenderNode
 */

/**
 * @typedef {AimRenderNode | AimRenderNode[] } Template
 */

/**
 * @template {string} TagName
 * @template Props
 * @template ComponentData
 * @typedef {{componentId?: string} & ((props?: Props) => AimElement<ComponentData>)} ComponentConstructor
 */

/**
 * @template ComponentData
 * @typedef {(HTMLElement & {
 *    data: ComponentData
 *    get: Document['querySelector']
 * })} AimElement
 */

/**
 * @template {string} TagName
 * @template {object} [Props=never]} ElementOptions
 */

/**
 * @template {string} TagName
 * @template {object} [Props=never]
 * @template {object} [ExtraData=never]
 * @typedef {{
 *  tag: TagName,
 *  styles?: string | Partial<CSSStyleDeclaration>,
 *  render: (props: ReplaceConstructors<Props>, data: ExtraData) => Template,
 *  defaultProps?: Props,
 *  data?: ExtraData & ThisType<AimElement<ExtraData>>
 * }} ElementConfig
 */

/**
 * @template {object} T
 * @typedef { {
 *     [K in keyof T]:
 *       T[K] extends new (...args: any) => infer U ?
 *         U extends String ? string :
 *         U extends Boolean ? boolean :
 *         U extends Number ? number : U
 *       : T[K]
 *   }
 * } ReplaceConstructors
 */

/** @type {Map<string, any>} */
const CUSTOM_ELEMENT_MAP = new Map();

/** @type {Map<string, CSSStyleSheet>} */
const CUSTOM_ELEMENT_STYLES = new Map();

/** @type {Map<string, HTMLElement>} */
const CUSTOM_ELEMENT_INSTANCE_CACHE = new Map();

/** @type {Map<string, Map<string, any>>} */
const GLOBAL_DATA = new Map();

export const html = String.raw;
export const css = String.raw;

class AimComponent extends HTMLElement {}

/**
 * Defines a custom HTML element with a shadow DOM and optional styles.
 *
 * @template {object} ComponentData
 * Additional data for the custom element.
 *
 * @template {string} [TagName=string]
 * The name of the custom element.
 *
 * @template {object} [Props=never]
 * The type of properties that the component accepts.
 *
 * @param {ElementConfig<TagName, Props, ComponentData>} elementConfig
 * The configuration object for the custom element.
 * @returns {ComponentConstructor<TagName, ReplaceConstructors<Props>, ComponentData>} A function that creates instances of the custom element.
 *
 * @example
 * // Define a custom element with a simple render function
 * const MyElement = defineComponent({
 *   tag: 'my-element',
 *   render: () => html`<div>Hello, World!</div>`,
 * });
 *
 * // Create an instance of the custom element
 * const myElement = MyElement();
 * document.body.appendChild(myElement);
 *
 * @example
 * // Define a custom element with props and styles
 * const MyButton = defineComponent({
 *   tag: 'my-button',
 *   styles: css`
 *   button {
 *     fontSize: '16px',
 *     fontWeight: 'bold',
 *   }`,
 *   render: (props) => html`<button style="color: ${props.color};">${props.label}</button>`,
 *  // Defines the default props for the custom element
 *   defaultProps: {
 *     color: 'black',
 *     label: 'Click me',
 *   },
 * });
 *
 * // Create an instance of the custom element with custom props
 * // You can define the element by using the result of the `defineComponent` function, like so:
 * const myButton = MyButton({ color: 'red', label: 'Click here' });
 * document.body.appendChild(myButton);
 *
 * // Or by defining the element directly as html:
 * document.body.innerHtml = html`<my-button color="red" label="Click here"></my-button>`;
 */
export function defineComponent(elementConfig) {
  const {
    tag,
    render,
    styles,
    defaultProps,
    data: componentData,
  } = elementConfig;
  const elementIdentifier = `${tag}`;
  const emptyProps = /** @type ReplaceConstructors<Props> */ ({});

  // Load component CSS.
  if (styles) {
    const stylesheet = new CSSStyleSheet();
    switch (typeof styles) {
      case 'string':
        stylesheet.replace(styles);
        break;
      case 'object':
        stylesheet.replace(convertObjectToCssStylesheet(styles));
        break;
    }
    CUSTOM_ELEMENT_STYLES.set(elementIdentifier, stylesheet);
  }

  class Component extends AimComponent {
    /**
     * Whether or not the component has been rendered by Aim.
     * @private
     */
    aim__isSetup = false;

    /**
     * The unique identifier for the component instance.
     * @type {string}
     */
    aim__instanceKey;

    /**
     * The data signal for the component instance.
     * @type {ComponentData}
     */
    // @ts-ignore
    data = {};

    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      const shadowRoot = /** @type {ShadowRoot} */ (this.shadowRoot);

      const stylesheet = /** @type {CSSStyleSheet} */ (
        CUSTOM_ELEMENT_STYLES.get(elementIdentifier)
      );
      if (stylesheet) {
        // inherit global styles so I can use keyframes and media queries.

        shadowRoot.adoptedStyleSheets = [stylesheet];
      }

      this.aim__instanceKey = generateInstanceKey(elementIdentifier);
    }

    /**
     * Sets up the component instance with the provided props and extra data.
     * @param {Partial<ReplaceConstructors<Props>>} [props] - The props to initialize the component with.
     * @returns {void}
     */
    __aim__setup(props = emptyProps) {
      const storage = new Map();
      GLOBAL_DATA.set(this.aim__instanceKey, storage);
      storage.set('owner', this);

      // Setup props.
      const defaultPropLiterals = /** @type ReplaceConstructors<Props> */ ({});
      for (const [key, value] of Object.entries(defaultProps ?? {})) {
        if (typeof value === 'object' && 'prototype' in value) {
          continue;
        }
        // @ts-ignore
        defaultPropLiterals[key] = value;
      }

      const finalProps =
        /** @type ReplaceConstructors<Props> */
        {
          ...defaultPropLiterals,
          ...props,
        };

      const finalPropsProxy = new Proxy(finalProps, {
        get(target, prop) {
          const storageKey = `props.${prop.toString()}`;
          // @ts-ignore
          storage.set(storageKey, target[prop]);
          // @ts-ignore
          return target[prop];
        },

        set(target, prop, value) {
          // @ts-ignore
          target[prop] = value;
          return true;
        },
      });

      // Setup component data.
      const data = /** @type ComponentData */ ({ ...(componentData ?? {}) });
      for (const [key, value] of Object.entries(data)) {
        if (isNotObject(value)) continue;

        value.__toStringNative = value.toString;
        value.toString = () => {
          const storageKey = `data.${key}`;
          storage.set(storageKey, value);
          return `${this.aim__instanceKey}@${storageKey}`;
        };

        // @ts-ignore
        data[key] = value;
      }
      this.data = data;

      const children = render.bind(elementConfig)(finalPropsProxy, this.data);

      // data functions should always use the element as the context.
      // This has to be done after rendering to prevent mismatches in serializing.
      for (const [key, value] of Object.entries(data)) {
        if (typeof value === 'function') {
          // @ts-ignore
          data[key] = value.bind(this);
        }
      }

      // @ts-ignore
      this.shadowRoot.replaceChildren(...generateChildNodes(children, this));

      this.aim__isSetup = true;
    }

    /**
     * @param {string} selector
     * @returns {Element | null}
     */
    get = (selector) => {
      return this.shadowRoot?.querySelector(selector) ?? null;
    };

    toString() {
      CUSTOM_ELEMENT_INSTANCE_CACHE.set(this.aim__instanceKey, this);
      return `<template aim-placeholder key=${this.aim__instanceKey}></template>`;
    }

    connectedCallback() {
      if (!this.aim__isSetup) {
        const attributes = getElementAttributes(this);
        const props = /** @type {Props} */ attributes;

        this.__aim__setup({
          ...(defaultProps ?? emptyProps),
          ...props,
        });

        for (const key of Object.keys(attributes)) {
          if (
            (defaultProps && key in defaultProps) ||
            GLOBAL_DATA.get(this.aim__instanceKey)?.has(`props.${key}`)
          ) {
            this.removeAttribute(key);
          }
        }
      }
    }

    disconnectedCallback() {
      CUSTOM_ELEMENT_INSTANCE_CACHE.delete(this.aim__instanceKey);
      GLOBAL_DATA.delete(this.aim__instanceKey);
    }
  }

  customElements.define(elementIdentifier, Component);
  CUSTOM_ELEMENT_MAP.set(elementIdentifier, Component);

  /** @param {Partial<ReplaceConstructors<Props>>} [props] */
  function factory(props) {
    const Constructor = CUSTOM_ELEMENT_MAP.get(factory.componentId);
    const element = /** @type {Component} */ (new Constructor(props));
    element.__aim__setup(props);

    return replaceComponentPlaceholders(element);
  }

  factory.componentId = elementIdentifier;

  return factory;
}

/**
 * Converts a string to kebab-case.
 * @param {string} str - The input string to convert.
 * @returns {string} The input string converted to kebab-case.
 */
function toKebabCase(str) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

/**
 * Generates an array of DOM nodes from a given input.
 *
 * @param {Element & {shadowRoot: ShadowRoot }} parent
 * @param {Template} children - The input to generate DOM nodes from.
 * @returns {Node[]}
 */
function generateChildNodes(children, parent) {
  /** @type {Node[]} */
  let nodes = [];

  if (typeof children === 'string') {
    const parser = new DOMParser();
    nodes = Array.from(
      parser.parseFromString(children, 'text/html').body.childNodes
    );
  }

  if (children instanceof DocumentFragment || children instanceof Element) {
    nodes = Array.from(children.childNodes);
  }

  if (Array.isArray(children)) {
    nodes = children.flatMap((child) => generateChildNodes(child, parent));
  }

  for (const node of nodes) {
    replaceEventListeners(node, parent);
  }

  return nodes;
}

/**
 * Generates an object containing the attributes of a given DOM element.
 *
 * @param {Element} element - The DOM element to extract attributes from.
 * @returns {Record<string, string>} An object where the keys are the attribute names and the values are the attribute values.
 */
function getElementAttributes(element) {
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
function replaceComponentPlaceholders(element) {
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

/**
 * Replaces event listeners on the given node with the corresponding listeners from the provided data.
 *
 * @param {Node} node - The DOM element to replace event listeners on.
 * @param {Element } parent - The parent component instance.
 */
function replaceEventListeners(node, parent) {
  if (!(node instanceof Element)) return;

  const attributes = Array.from(node.attributes).filter((attribute) =>
    attribute.name.startsWith('on')
  );

  for (const attribute of attributes) {
    const eventName = attribute.name.slice(2);
    const [namespaceKey, listenerKey] = attribute.value.split('@');

    const namespace = GLOBAL_DATA.get(namespaceKey);
    const listener = namespace?.get(listenerKey);
    const listenerOwner = namespace?.get('owner');

    if (listener && !customElements.get(node.tagName.toLowerCase())) {
      node.addEventListener(eventName, listener.bind(listenerOwner));
      node.removeAttribute(attribute.name);
    }
  }

  for (const child of Array.from(node.children)) {
    replaceEventListeners(child, parent);
  }
}

/**
 * Converts an object of styles to a CSS stylesheet string.
 *
 * @param {Partial<CSSStyleDeclaration>} styles - An object where the keys are CSS property names and the values are CSS property values.
 * @returns {string} A CSS stylesheet string that can be applied as a style to an HTML element.
 */
function convertObjectToCssStylesheet(styles) {
  return `:host {${Object.entries(styles)
    .map(([key, value]) => `${toKebabCase(key)}: ${value}`)
    .join('\n;')}}`;
}

/**
 * Generates a unique key for a custom element instance.
 *
 * @param {string} elementIdentifier - A unique identifier for the custom element.
 * @returns {string} A unique key for the custom element instance.
 */
function generateInstanceKey(elementIdentifier) {
  let key = `${elementIdentifier}-${Math.random().toString(36).slice(2)}`;
  while (CUSTOM_ELEMENT_INSTANCE_CACHE.has(key)) {
    key = `${elementIdentifier}-${Math.random().toString(36).slice(2)}`;
  }
  return key;
}

/**
 * Checks if the given value is not an object.
 *
 * @param {any} value - The value to check.
 * @returns {boolean} `true` if the value is not an object, `false` otherwise.
 */
function isNotObject(value) {
  return (
    !value.toString || !/function|object/.test(typeof value) || value === null
  );
}
