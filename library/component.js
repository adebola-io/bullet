import {
  CUSTOM_ELEMENT_INSTANCE_CACHE,
  CUSTOM_ELEMENT_MAP,
  CUSTOM_ELEMENT_STYLES,
  CUSTOM_ELEMENT_GLOBAL_STYLES,
  GLOBAL_DATA,
} from './constants.js';
import {
  convertObjectToCssStylesheet,
  generateInstanceKey,
  getElementAttributes,
  replaceComponentPlaceholders,
  generateChildNodes,
  generateComponentName,
} from './utils.js';

/**
 * @typedef {Node | string} AimRenderNode
 */

/**
 * @typedef {AimRenderNode | AimRenderNode[]} Template
 */

/**
 * @template Props
 * @typedef {{ componentId?: string; } &
 *  (keyof Props extends never ? ((props?: {}) => BulletElement<{}>) : (props: Props) => BulletElement<{}>)} Component
 */

/**
 * @template ComponentData
 * @typedef {(HTMLElement & {
 *    data: ComponentData
 *    select: Element['querySelector']
 *    selectAll: Element['querySelectorAll']
 * })} BulletElement
 */

/**
 * @template {string} TagName
 * @template {object} [Props=never]} ElementOptions
 */

/**
 * @template ExtraData
 * @template RenderProps
 * @template DefaultProps
 * @typedef {(this: BulletElement<ExtraData>, props: keyof RenderProps extends never ? DefaultProps : RenderProps, data: ExtraData) => Template | Promise<Template>} RenderFunction
 */

/**
 * @template {DefaultProps} [Props=never]
 * @template {object} [ExtraData=never]
 * @template {Partial<Props>} [DefaultProps={}]
 * @template {object} [RenderProps=Props]
 *
 * @typedef ElementConfig
 * @property {string} [tag]
 * The HTML tag name to use for the custom element.
 * @property {string | Partial<CSSStyleDeclaration>} [styles]
 * The CSS styles to apply within the custom element. The styles are scoped to the custom element's shadow root.
 * @property {string | Partial<CSSStyleDeclaration>} [globalStyles]
 * CSS styles that should be applied globally to the parent document. They are only valid as long as there is at least one
 * instance of the component in the document.
 * @property {RenderFunction<ExtraData, RenderProps, DefaultProps>} render
 * A function that generates the content for the component's shadow root. It accepts the props of the component and the component data as arguments.
 * @property {DefaultProps} [defaultProps]
 * Defines the default props for the custom element.
 * @property {(props: keyof RenderProps extends never ? DefaultProps : RenderProps) => ExtraData & ThisType<BulletElement<ExtraData>>} [data]
 * Additional data for the custom element.
 */

// /**
//  * @template {object} T
//  * @typedef { {
//  *     [K in keyof T]:
//  *       T[K] extends new (...args: any) => infer U ?
//  *         U extends String ? string :
//  *         U extends Boolean ? boolean :
//  *         U extends Number ? number : U
//  *       : T[K]
//  *   }
//  * } ReplaceConstructors
//  */

export const html = generateChildNodes;
export const css = String.raw;

class AimComponent extends HTMLElement {}

/**
 * Defines a custom HTML element with a shadow DOM and optional styles.
 *
 * @template {object} RenderPropsInitial
 *
 *
 * @template {object} [ComponentData={}]
 * Additional data for the custom element.
 *
 * @template {object} [Props=RenderPropsInitial]
 * The type of properties that the component accepts.
 *
 * @template {object} [DefaultProps={}]
 * Defines the default props for the custom element.
 *
 * @template {Props & DefaultProps} [RenderProps=Props & DefaultProps]
 *
 * @param {ElementConfig<Props & DefaultProps & RenderProps, ComponentData, DefaultProps, RenderPropsInitial>
 * |  RenderFunction<ComponentData, RenderProps, DefaultProps>} elementConfig
 * The configuration object for the custom element.
 *
 * @returns {keyof Props extends never ? Component<Partial<DefaultProps>>: Component<Props>} A function that creates instances of the custom element.
 * @example
 * // Define a custom element with a simple render function
 * const MyElement = component(() => <div>Hello, World!</div>);
 *
 * // Create an instance of the custom element
 * const myElement = <MyElement />;
 * document.body.appendChild(myElement);
 *
 * @example
 * // Define a custom element with props and styles
 * const MyButton = component({
 *   styles: css`
 *   button {
 *     fontSize: '16px',
 *     fontWeight: 'bold',
 *   }`,
 *   render: (props) => <button style={{ color: props.color }}>{props.label}</button>,
 *  // Defines the default props for the custom element
 *   defaultProps: {
 *     color: 'black',
 *     label: 'Click me',
 *   },
 * });
 *
 * // Create an instance of the custom element with custom props
 * // You can define the element by using the result of the `component` function, like so:
 * const myButton = <MyButton color="red" label="Click here" />; // or MyButton({color: 'red', label: 'Click here' })
 * document.body.appendChild(myButton);
 *
 * // Or by defining the element directly as html:
 * document.body.innerHtml = '<bt-my-button color="red" label="Click here"></bt-my-button>';
 */
export function component(elementConfig) {
  const {
    render,
    styles,
    globalStyles,
    defaultProps,
    data: componentData,
    tag,
  } = typeof elementConfig === 'function'
    ? {
        render: elementConfig,
        styles: undefined,
        defaultProps: undefined,
        data: undefined,
        tag: undefined,
        globalStyles: undefined,
      }
    : elementConfig;
  const elementTagname = `bt-${tag ?? generateComponentName()}`;

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
    CUSTOM_ELEMENT_STYLES.set(elementTagname, stylesheet);
  }

  // Load global CSS.
  if (globalStyles) {
    const styleString =
      typeof globalStyles === 'string'
        ? globalStyles
        : convertObjectToCssStylesheet(globalStyles);
    CUSTOM_ELEMENT_GLOBAL_STYLES.set(elementTagname, {
      data: styleString,
      instances: 0,
    });
  }

  class ComponentConstructor extends AimComponent {
    /**
     * Whether or not the component has been rendered by Aim.
     * @private
     */
    bullet__isSetup = false;

    /**
     * The unique identifier for the component instance.
     * @type {string}
     */
    bullet__instanceKey;

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

      const stylesheet = CUSTOM_ELEMENT_STYLES.get(elementTagname);
      if (stylesheet) {
        shadowRoot.adoptedStyleSheets = [stylesheet];
      }
      const globalStyles = CUSTOM_ELEMENT_GLOBAL_STYLES.get(elementTagname);
      if (globalStyles) {
        globalStyles.instances += 1;

        if (globalStyles.instances === 1) {
          const styleElement = document.createElement('style');
          styleElement.setAttribute('blt-component', elementTagname);
          styleElement.innerHTML = globalStyles.data;
          document.head.appendChild(styleElement);
        }
      }

      this.bullet__instanceKey = generateInstanceKey(elementTagname);
    }

    /**
     * Sets up the component instance with the provided props and extra data.
     * @param {Partial<Props>} [props] - The props to initialize the component with.
     */
    __bullet__setup(props = {}) {
      const storage = new Map();
      GLOBAL_DATA.set(this.bullet__instanceKey, storage);
      storage.set('owner', this);

      const finalProps = {
        ...defaultProps,
        ...props,
      };

      // Setup component data.
      /** @type ComponentData */ // @ts-ignore
      const data = componentData?.bind(this)?.(finalProps);
      this.data = data;

      /** @type {Template | Promise<Template>}*/ // @ts-ignore
      const children = render.bind(this)(finalProps, this.data);

      if (children instanceof Promise) {
        children.then((children) => {
          this.shadowRoot?.replaceChildren(...generateChildNodes(children));
        });
      } else {
        this.shadowRoot?.replaceChildren(...generateChildNodes(children));
      }

      this.bullet__isSetup = true;
    }

    /**
     * @param {string} selector
     * @returns {Element | null}
     */
    select = (selector) => {
      const shadowRoot = /** @type {ShadowRoot} */ (this.shadowRoot);
      return shadowRoot.querySelector(selector);
    };

    /**
     * @param {string} selector
     * @returns {NodeListOf<Element>}
     */
    selectAll = (selector) => {
      const shadowRoot = /** @type {ShadowRoot} */ (this.shadowRoot);
      return shadowRoot.querySelectorAll(selector);
    };

    toString() {
      CUSTOM_ELEMENT_INSTANCE_CACHE.set(this.bullet__instanceKey, this);
      return `<template bt-placeholder key=${this.bullet__instanceKey}></template>`;
    }

    connectedCallback() {
      if (!this.bullet__isSetup) {
        const attributes = getElementAttributes(this);
        const props = /** @type {Props} */ (attributes);

        this.__bullet__setup(props);

        for (const key of Object.keys(attributes)) {
          if (
            (defaultProps && key in defaultProps) ||
            GLOBAL_DATA.get(this.bullet__instanceKey)?.has(`props.${key}`)
          ) {
            this.removeAttribute(key);
          }
        }
      }
    }

    disconnectedCallback() {
      CUSTOM_ELEMENT_INSTANCE_CACHE.delete(this.bullet__instanceKey);
      GLOBAL_DATA.delete(this.bullet__instanceKey);
      const globalStyles = CUSTOM_ELEMENT_GLOBAL_STYLES.get(elementTagname);
      if (globalStyles) {
        globalStyles.instances -= 1;

        if (globalStyles.instances === 0) {
          document
            .querySelector(`style[blt-component="${elementTagname}"]`)
            ?.remove();
        }
      }
    }
  }

  customElements.define(elementTagname, ComponentConstructor);
  CUSTOM_ELEMENT_MAP.set(elementTagname, ComponentConstructor);

  /** @param {Partial<Props>} [props] */
  function factory(props) {
    const Constructor = CUSTOM_ELEMENT_MAP.get(factory.componentId);
    const element = /** @type {ComponentConstructor} */ (
      new Constructor(props)
    );
    element.__bullet__setup(props);

    return replaceComponentPlaceholders(element);
  }

  factory.componentId = elementTagname;

  // @ts-ignore
  return factory;
}
