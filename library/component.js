import {
  CUSTOM_ELEMENT_INSTANCE_CACHE,
  CUSTOM_ELEMENT_MAP,
  CUSTOM_ELEMENT_STYLES,
  CUSTOM_ELEMENT_GLOBAL_STYLES,
  GLOBAL_DATA,
  CUSTOM_ELEMENT_NODE_LIST,
} from './constants.js';
import {
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
 * @typedef {AimRenderNode | AimRenderNode[] | undefined} Template
 */

/**
 * @template Props
 * @typedef {Props & JSX.JsxNativeProps} ComponentProps
 */

/**
 * @template Props
 * @template [Data={}]
 * @typedef {{ tagName: string } &
 *  (keyof Props extends never ? ((props?: {}) => BulletElement<{}>) : (props: ComponentProps<Props>) => BulletElement<Data>)} Component
 */

/**
 * @template [ComponentData={}]
 * @typedef CustomElementProperties
 *
 * @property {ComponentData} data
 * The extra data associated with the custom element.
 *
 * @property {Element['querySelector']} select
 * Selects the first element that matches the specified CSS selector within the custom element's shadow root.
 *
 * @property {Element['querySelectorAll']} selectAll
 * Selects all elements that match the specified CSS selector within the custom element's shadow root.
 *
 * @property {() => void} render
 * Triggers a re-render of the element's template.
 * This is useful when you want to update the element's content based on changes in the component's data,
 * but it should not be used liberally, as it can lead to performance issues.
 *
 * @property {boolean} isFormAssociated
 * Whether or not the component is associated with a form.
 *
 * @property {ElementInternals} elementInternals
 * Returns the internals of the element.
 */

/**
 * @template [ComponentData={}]
 * @typedef {(HTMLElement & CustomElementProperties<ComponentData>)} BulletElement
 */

/**
 * @template {string} TagName
 * @template {object} [Props=never]} ElementOptions
 */

/**
 * @template ExtraData
 * @template RenderProps
 * @template DefaultProps
 * @template {boolean} Async
 * @typedef {(this: BulletElement<ExtraData>, props: keyof RenderProps extends never ? DefaultProps : RenderProps, data: ExtraData) => Async extends true ? Template | Promise<Template>: Template} RenderFunction
 */

/**
 * @template {DefaultProps} [Props=never]
 * @template {object} [ExtraData=never]
 * @template {Partial<Props>} [DefaultProps={}]
 * @template {object} [RenderProps=Props]
 *
 * @typedef ElementConfig
 *
 * @property {string} [tag]
 * The HTML tag name to use for the custom element.
 *
 * @property {CSSStyleSheet} [styles]
 * The CSS styles to apply within the custom element. The styles are scoped to the custom element's shadow root.
 *
 * @property {CSSStyleSheet} [globalStyles]
 * CSS styles that should be applied globally to the parent document. They are only valid as long as there is at least one
 * instance of the component in the document.
 *
 * @property {RenderFunction<ExtraData, RenderProps, DefaultProps, true>} [render]
 * A function that generates the content for the component's shadow root. It accepts the props of the component and the component data as arguments.
 *
 * @property {DefaultProps} [defaultProps]
 * Defines the default props for the custom element.
 *
 * @property {(this: BulletElement, props: keyof RenderProps extends never ? DefaultProps : RenderProps) => ExtraData} [data]
 * Additional data for the custom element.
 *
 * @property {(this: BulletElement<ExtraData>, props: keyof RenderProps extends never ? DefaultProps : RenderProps) => any} [connected]
 * Called when the component is mounted to the DOM.
 * It can optionally return a function that will be called when the component is unmounted from the DOM.
 *
 * @property {(() => void)} [disconnected]
 * Called when the component is unmounted from the DOM.
 *
 * @property {(this: BulletElement<ExtraData>, error: unknown, props: keyof RenderProps extends never ? DefaultProps : RenderProps, data: ExtraData) => Template} [fallback]
 * If the render function throws an error, this function will be called to render a fallback template for the component.
 * It is most useful for asynchronous rendering, where the render function returns a promise that may be rejected.
 *
 * @property {RenderFunction<ExtraData, RenderProps, DefaultProps, false>} [initial]
 * A function that generates a starting template for the component. It will be render as a placeholder if the `render()` function
 * is async, and is yet to be resolved.
 *
 * @property {boolean} [formAssociated]
 * Whether or not the component is associated with a form.
 */

/**
 * Generates a set of child nodes from an HTML string.
 *
 * @param {string} html - The HTML string to generate child nodes from.
 * @returns {Node[]} - An array of child nodes generated from the HTML string.
 */
export const html = generateChildNodes;

/**
 * Generates a CSS stylesheet from a CSS text string.
 *
 * @param {string | TemplateStringsArray} template - The CSS text to create the stylesheet from.
 * @param {any[]} substitutions
 * @returns {CSSStyleSheet} - The generated CSS stylesheet.
 */
export const css = (template, ...substitutions) => {
  const stylesheet = new CSSStyleSheet();
  if (typeof template === 'string') {
    stylesheet.replaceSync(template);
  } else {
    const cssText = String.raw(template, ...substitutions);
    stylesheet.replaceSync(cssText);
  }
  return stylesheet;
};

export class BulletComponent extends HTMLElement {}

/**
 * @typedef SetupOptions
 * @property {string} [namespace]
 * A namespace to scope your custom elements to. This will ensure that they do not affect
 * other custom elements in the DOM.
 */

/**
 * @typedef {ReturnType<typeof setupInternal>['createElement']} ElementConstructor
 */

/**
 * @typedef SetupResult
 * @property {ElementConstructor} createElement
 * Defines a custom HTML element with a shadow DOM and optional styles.
 */

/** @param {SetupOptions} [setupOptions] */
function setupInternal(setupOptions) {
  const { namespace } = setupOptions ?? {};

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
   * |  RenderFunction<ComponentData, RenderProps, DefaultProps, true>} elementConfig
   * The configuration object for the custom element.
   *
   * @returns {keyof Props extends never ? Component<Partial<DefaultProps>>: Component<Props, ComponentData>} A function that creates instances of the custom element.
   * @example
   * // Define a custom element with a simple render function
   * const MyElement = createElement(() => <div>Hello, World!</div>);
   *
   * // Create an instance of the custom element
   * const myElement = <MyElement />;
   * document.body.appendChild(myElement);
   *
   * @example
   * // Define a custom element with props and styles
   * const MyButton = createElement({
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
   * document.body.innerHtml = '<my-button color="red" label="Click here"></my-button>';
   */
  const createElement = function (elementConfig) {
    const {
      render,
      styles,
      globalStyles,
      defaultProps,
      data: componentData,
      tag,
      formAssociated,
      connected,
      disconnected,
      fallback,
      initial,
    } = typeof elementConfig === 'function'
      ? {
          render: elementConfig,
          styles: undefined,
          defaultProps: undefined,
          data: undefined,
          tag: undefined,
          formAssociated: undefined,
          globalStyles: undefined,
          connected: undefined,
          disconnected: undefined,
          fallback: undefined,
          initial: undefined,
        }
      : elementConfig;
    const elementTagname = `${namespace ? `${namespace}-` : ''}${
      tag ?? generateComponentName()
    }`;

    // Load component CSS.
    if (styles) {
      CUSTOM_ELEMENT_STYLES.set(elementTagname, styles);
    }

    // Load global CSS.
    if (globalStyles) {
      CUSTOM_ELEMENT_GLOBAL_STYLES.set(elementTagname, {
        data: globalStyles,
        instances: 0,
      });
    }

    let ComponentConstructor = class extends BulletComponent {
      bullet__isRandomTagname = tag === undefined;
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
       * Called when the component is mounted to the DOM.
       *
       */
      //@ts-ignore
      bullet__connected = connected?.bind(this);

      /**
       * Called when the component is unmounted from the DOM.
       */
      bullet__disconnected = disconnected?.bind(this);

      /**
       * The data signal for the component instance.
       * @type {ComponentData}
       */
      // @ts-ignore
      data = {};

      /** @type {any} */
      bullet__finalProps;

      constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.elementInternals = this.attachInternals();
        this.isFormAssociated = ComponentConstructor.formAssociated;
        const shadowRoot = /** @type {ShadowRoot} */ (this.shadowRoot);

        const stylesheet = CUSTOM_ELEMENT_STYLES.get(elementTagname);
        if (stylesheet) {
          shadowRoot.adoptedStyleSheets = [stylesheet];
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

        this.bullet__finalProps = finalProps;

        // Setup component data.
        /** @type ComponentData */ // @ts-ignore
        const data = componentData?.bind(this)?.(finalProps);
        this.data = data;

        /** @param {Template} children */
        const appendTemplate = (children) => {
          this.shadowRoot?.replaceChildren(...generateChildNodes(children));
        };

        const renderInitial = () => {
          if (initial) {
            /** @type {Template | Promise<Template>}*/ // @ts-ignore
            const children = initial.bind(this)(finalProps, this.data);
            appendTemplate(children);
          }
        };

        /** @param {unknown} error */
        const renderFallback = (error) => {
          if (fallback) {
            const finalFallbackProps = /** @type {any} */ (finalProps);
            // @ts-ignore
            const children = fallback.bind(this)(
              error,
              finalFallbackProps,
              this.data
            );
            appendTemplate(children);
          } else {
            throw error;
          }
        };

        this.render = function () {
          // Render the component.
          try {
            if (render === undefined) {
              renderInitial();
              return;
            }
            /** @type {Template | Promise<Template>}*/ // @ts-ignore
            const renderResult = render.bind(this)(finalProps, this.data);
            if (renderResult instanceof Promise) {
              renderInitial();
              renderResult.then(appendTemplate).catch(renderFallback);
            } else {
              appendTemplate(renderResult);
            }
          } catch (error) {
            renderFallback(error);
          }
        };

        this.render();

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
        const nodeList =
          CUSTOM_ELEMENT_NODE_LIST.get(elementTagname) ?? new Map();
        nodeList.set(this, true);
        CUSTOM_ELEMENT_NODE_LIST.set(elementTagname, nodeList);

        const attributes = getElementAttributes(this);
        const props = /** @type {Props} */ (attributes);
        if (!this.bullet__isSetup) {
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

        const globalStyles = CUSTOM_ELEMENT_GLOBAL_STYLES.get(elementTagname);
        if (globalStyles) {
          globalStyles.instances += 1;

          if (globalStyles.instances === 1) {
            document.adoptedStyleSheets.push(globalStyles.data);
          }
        }

        this.bullet__connectedReturn = this.bullet__connected?.(
          /** @type {any} */ (this.bullet__finalProps ?? props)
        );
      }

      disconnectedCallback() {
        CUSTOM_ELEMENT_INSTANCE_CACHE.delete(this.bullet__instanceKey);
        GLOBAL_DATA.delete(this.bullet__instanceKey);
        CUSTOM_ELEMENT_NODE_LIST.get(elementTagname)?.delete(this);
        const globalStyles = CUSTOM_ELEMENT_GLOBAL_STYLES.get(elementTagname);
        if (globalStyles) {
          globalStyles.instances -= 1;

          if (globalStyles.instances === 0) {
            document.adoptedStyleSheets = document.adoptedStyleSheets.filter(
              (style) => style !== globalStyles.data
            );
          }
        }

        if (typeof this.bullet__connectedReturn === 'function') {
          this.bullet__connectedReturn();
        } else if (Array.isArray(this.bullet__connectedReturn)) {
          for (const fn of this.bullet__connectedReturn) {
            if (typeof fn === 'function') {
              fn();
            }
          }
        }
        this.bullet__disconnected?.();
      }
    };

    ComponentConstructor.formAssociated = formAssociated;

    // @ts-ignore
    const previousConstructor = CUSTOM_ELEMENT_MAP.get(elementTagname);

    if (previousConstructor) {
      previousConstructor.prototype.__bullet__setup =
        ComponentConstructor.prototype.__bullet__setup;
      ComponentConstructor = previousConstructor;
    }

    const previouslyDefined = customElements.get(elementTagname);
    if (previouslyDefined && previouslyDefined !== ComponentConstructor) {
      throw new Error(
        `A custom element with the tag name "${elementTagname}" has already been defined.`
      );
    }

    if (!previouslyDefined && !previousConstructor) {
      customElements.define(elementTagname, ComponentConstructor);
    }

    CUSTOM_ELEMENT_MAP.set(elementTagname, ComponentConstructor);

    /** @param {Partial<Props>} [props] */
    function factory(props) {
      const Constructor = CUSTOM_ELEMENT_MAP.get(
        factory.tagName.replace(/\\\./g, '.')
      );
      const element = /** @type {ComponentConstructor} */ (
        new Constructor(props)
      );
      element.__bullet__setup(props);

      return replaceComponentPlaceholders(element);
    }

    factory.tagName = elementTagname.replace(/\./g, '\\.');
    factory.__isBulletConstructor__ = true;
    factory.__isRandomTagname = tag === undefined;

    // @ts-ignore
    return factory;
  };

  return {
    // @ts-ignore
    createElement,
  };
}

/**
 * @type {(setupOptions?: SetupOptions) => SetupResult}
 */
export const setup = setupInternal;
export const { createElement } = setup();
