/**
 * @typedef {Node | string} AimRenderNode
 */
/**
 * @typedef {AimRenderNode | AimRenderNode[] | undefined | void} Template
 */
/**
 * @template Props
 * @typedef {Props & JSX.JsxNativeProps & JSX.JsxCustomElementAttributes} ComponentProps
 */
/**
 * @typedef {object} ComponentMeta
 * @property {boolean} [createdByJsx]
 * Whether or not the component was created using the JSX syntax.
 */
/**
 * @template Props
 * @template [Data={}]
 * @typedef {{ tagName: string } &
 *  (keyof Props extends never ? ((props?: ComponentProps<{}>) => BulletElement<{}>) : (props: ComponentProps<Props>) => BulletElement<Data>)} Component
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
 *
 * @property {AbortController} controller
 * A controller for the element that aborts when the element is disconnected. It can be used to cancel
 * long-running tasks or unsubscribe from events.
 */
/**
 * @template [ComponentData={}]
 * @typedef {(HTMLElement & CustomElementProperties<ComponentData>)} BulletElement
 */
/**
 * Merges two types, making overlapping properties optional and preferring the type from T when different.
 * @template {object} T The primary type
 * @template {object} U The secondary type
 * @typedef {Omit<T, keyof U> & {[K in Extract<keyof T, keyof U>]?: T[K]}} Merge
 */
/**
 * @template {object} T
 * @template {object} U
 * @typedef {T extends U ? true : keyof T extends keyof U ? true : false} IsSubObject
 */
/**
 * @typedef {CSSStyleSheet
 *  | Promise<CSSStyleSheet>
 *  | Array<CSSStyleSheet
 *  | Promise<CSSStyleSheet>>
 * } CustomElementStyles
 * Styles to apply to the component/element.
 */
/**
 * @typedef {string
 *  | TemplateStringsArray
 *  | Promise<string | {default: string}>
 *  | Array<string | TemplateStringsArray | Promise<string | {default: string}>>
 * } CSSorStringArray
 * A CSS or string array.
 */
/**
 * @template {string} TagName
 * @template {object} [Props=never]} ElementOptions
 */
/**
 * @template Props
 * @template ExtraData
 * @typedef {(
 *    this: BulletElement<ExtraData>,
 *    props: Props,
 *    data: ExtraData,
 *    element: BulletElement<ExtraData>
 *  ) =>  Template | Promise<Template>} RenderFunction
 */
/**
 * @template {object} [Props={}]
 * @template {keyof Props extends never ? object : Partial<Props>} [DefaultProps=never]
 * @template {object} [ExtraData=never]
 *
 * @typedef ElementConfig
 *
 * @property {string} [tag]
 * The HTML tag name to use for the custom element.
 *
 * @property {CustomElementStyles} [styles]
 * The CSS styles to apply within the custom element. The styles are scoped to the custom element's shadow root.
 *
 * @property {CustomElementStyles} [globalStyles]
 * CSS styles that should be applied globally to the parent document. They are only valid as long as there is at least one
 * instance of the component in the document.
 *
 * @property {RenderFunction<Props, ExtraData>} [render]
 * A function that generates the content for the component's shadow root. It accepts the props of the component and the component data as arguments.
 *
 * @property {DefaultProps & Partial<Props>} [defaultProps]
 * Defines the default props for the custom element.
 *
 * @property {(this: BulletElement, props: Props) => ExtraData} [data]
 * Additional data for the custom element.
 *
 * @property {(this: BulletElement<ExtraData>, props: Props, element: BulletElement<ExtraData>) => any} [connected]
 * Called when the component is mounted to the DOM.
 * It can optionally return a function that will be called when the component is unmounted from the DOM.
 *
 * @property {(this: BulletElement<ExtraData>, element: BulletElement<ExtraData>) => void} [disconnected]
 * Called when the component is unmounted from the DOM.
 *
 * @property {(this: BulletElement<ExtraData>, error: unknown, props: Props, data: ExtraData) => Template} [fallback]
 * If the render function throws an error, this function will be called to render a fallback template for the component.
 * It is most useful for asynchronous rendering, where the render function returns a promise that may be rejected.
 *
 * @property {(this: BulletElement<ExtraData>, props: Props, data: ExtraData) => Template} [initial]
 * A function that generates a starting template for the component. It will be render as a placeholder if the `render()` function
 * is async, and is yet to be resolved.
 *
 * @property {boolean} [formAssociated]
 * Whether or not the component is associated with a form.
 *
 * @property {string} [part]
 * The part attribute to attach to the base element.
 *
 * @property {string} [class]
 * The class attribute to attach to the base element.
 */
/**
 * Generates a set of child nodes from an HTML string.
 *
 * @param {string} html - The HTML string to generate child nodes from.
 * @returns {Node[]} - An array of child nodes generated from the HTML string.
 */
export const html: typeof generateChildNodes;
export function css(template: CSSorStringArray, ...substitutions: any[]): Array<CSSStyleSheet>;
/**
 * @type {(setupOptions?: SetupOptions) => SetupResult}
 */
export const setup: (setupOptions?: SetupOptions) => SetupResult;
export { getCurrentElement } from "./utils.js";
/**
 * Defines a custom HTML element with a shadow DOM and optional styles.
 *
 * @template {object} [Props={}]
 * The type of properties that the component accepts.
 *
 * @template {object} [ComponentData={}]
 * Additional data for the custom element.
 *
 * @template {object} [DefaultProps={}]
 * The default props for the custom element.
 *
 * @param {ElementConfig<Props, DefaultProps, ComponentData> | (() => Template | Promise<Template>)} elementConfig
 * The configuration object for the custom element.
 *
 * @returns {Component<IsSubObject<DefaultProps, Props> extends true ? Props : Merge<Props, DefaultProps>,ComponentData>}
 * A function that creates instances of the custom element.
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
export function createElement<Props_1 extends object = {}, ComponentData extends object = {}, DefaultProps extends object = {}>(elementConfig: ElementConfig<Props_1, DefaultProps, ComponentData> | (() => Template | Promise<Template>)): Component<IsSubObject<DefaultProps, Props_1> extends true ? Props_1 : Merge<Props_1, DefaultProps>, ComponentData>;
export type SetupOptions = {
    /**
     * A namespace to scope your custom elements to. This will ensure that they do not affect
     * other custom elements in the DOM.
     */
    namespace?: string | undefined;
    /**
     * An optional array of CSS stylesheets or strings to be applied to every component created with this setup.
     * These styles will be scoped to the component's shadow DOM if it has one.
     * Can be a mix of CSSStyleSheet objects, strings, or promises that resolve to either.
     */
    styles?: (CSSStyleSheet | Promise<CSSStyleSheet>)[] | undefined;
};
export type ElementConstructor = ReturnType<typeof setupInternal>["createElement"];
export type SetupResult = {
    /**
     * Returns the custom element that is currently being rendered.
     */
    createElement: ElementConstructor;
};
export type AimRenderNode = Node | string;
export type Template = AimRenderNode | AimRenderNode[] | undefined | void;
export type ComponentProps<Props_1> = Props_1 & JSX.JsxNativeProps & JSX.JsxCustomElementAttributes;
export type ComponentMeta = {
    /**
     * Whether or not the component was created using the JSX syntax.
     */
    createdByJsx?: boolean | undefined;
};
export type Component<Props_1, Data = {}> = {
    tagName: string;
} & (keyof Props_1 extends never ? ((props?: ComponentProps<{}>) => BulletElement<{}>) : (props: ComponentProps<Props_1>) => BulletElement<Data>);
export type CustomElementProperties<ComponentData = {}> = {
    /**
     * The extra data associated with the custom element.
     */
    data: ComponentData;
    /**
     * Selects the first element that matches the specified CSS selector within the custom element's shadow root.
     */
    select: Element["querySelector"];
    /**
     * Selects all elements that match the specified CSS selector within the custom element's shadow root.
     */
    selectAll: Element["querySelectorAll"];
    /**
     * Triggers a re-render of the element's template.
     * This is useful when you want to update the element's content based on changes in the component's data,
     * but it should not be used liberally, as it can lead to performance issues.
     */
    render: () => void;
    /**
     * Whether or not the component is associated with a form.
     */
    isFormAssociated: boolean;
    /**
     * Returns the internals of the element.
     */
    elementInternals: ElementInternals;
    /**
     * A controller for the element that aborts when the element is disconnected. It can be used to cancel
     * long-running tasks or unsubscribe from events.
     */
    controller: AbortController;
};
export type BulletElement<ComponentData = {}> = (HTMLElement & CustomElementProperties<ComponentData>);
/**
 * Merges two types, making overlapping properties optional and preferring the type from T when different.
 */
export type Merge<T extends object, U extends object> = Omit<T, keyof U> & { [K in Extract<keyof T, keyof U>]?: T[K]; };
export type IsSubObject<T extends object, U extends object> = T extends U ? true : keyof T extends keyof U ? true : false;
/**
 * Styles to apply to the component/element.
 */
export type CustomElementStyles = CSSStyleSheet | Promise<CSSStyleSheet> | Array<CSSStyleSheet | Promise<CSSStyleSheet>>;
/**
 * A CSS or string array.
 */
export type CSSorStringArray = string | TemplateStringsArray | Promise<string | {
    default: string;
}> | Array<string | TemplateStringsArray | Promise<string | {
    default: string;
}>>;
export type RenderFunction<Props_1, ExtraData> = (this: BulletElement<ExtraData>, props: Props_1, data: ExtraData, element: BulletElement<ExtraData>) => Template | Promise<Template>;
export type ElementConfig<Props_1 extends object = {}, DefaultProps extends keyof Props_1 extends never ? object : Partial<Props_1> = never, ExtraData extends object = never> = {
    /**
     * The HTML tag name to use for the custom element.
     */
    tag?: string | undefined;
    /**
     * The CSS styles to apply within the custom element. The styles are scoped to the custom element's shadow root.
     */
    styles?: CustomElementStyles | undefined;
    /**
     * CSS styles that should be applied globally to the parent document. They are only valid as long as there is at least one
     * instance of the component in the document.
     */
    globalStyles?: CustomElementStyles | undefined;
    /**
     * A function that generates the content for the component's shadow root. It accepts the props of the component and the component data as arguments.
     */
    render?: RenderFunction<Props_1, ExtraData> | undefined;
    /**
     * Defines the default props for the custom element.
     */
    defaultProps?: (DefaultProps & Partial<Props_1>) | undefined;
    /**
     * Additional data for the custom element.
     */
    data?: ((this: BulletElement, props: Props_1) => ExtraData) | undefined;
    /**
     * Called when the component is mounted to the DOM.
     * It can optionally return a function that will be called when the component is unmounted from the DOM.
     */
    connected?: ((this: BulletElement<ExtraData>, props: Props_1, element: BulletElement<ExtraData>) => any) | undefined;
    /**
     * Called when the component is unmounted from the DOM.
     */
    disconnected?: ((this: BulletElement<ExtraData>, element: BulletElement<ExtraData>) => void) | undefined;
    /**
     * If the render function throws an error, this function will be called to render a fallback template for the component.
     * It is most useful for asynchronous rendering, where the render function returns a promise that may be rejected.
     */
    fallback?: ((this: BulletElement<ExtraData>, error: unknown, props: Props_1, data: ExtraData) => Template) | undefined;
    /**
     * A function that generates a starting template for the component. It will be render as a placeholder if the `render()` function
     * is async, and is yet to be resolved.
     */
    initial?: ((this: BulletElement<ExtraData>, props: Props_1, data: ExtraData) => Template) | undefined;
    /**
     * Whether or not the component is associated with a form.
     */
    formAssociated?: boolean | undefined;
    /**
     * The part attribute to attach to the base element.
     */
    part?: string | undefined;
    /**
     * The class attribute to attach to the base element.
     */
    class?: string | undefined;
};
import { generateChildNodes } from './utils.js';
/**
 * @typedef SetupOptions
 *
 * @property {string} [namespace]
 * A namespace to scope your custom elements to. This will ensure that they do not affect
 * other custom elements in the DOM.
 *
 * @property {Array<CSSStyleSheet | Promise<CSSStyleSheet>>} [styles]
 * An optional array of CSS stylesheets or strings to be applied to every component created with this setup.
 * These styles will be scoped to the component's shadow DOM if it has one.
 * Can be a mix of CSSStyleSheet objects, strings, or promises that resolve to either. */
/**
 * @typedef {ReturnType<typeof setupInternal>['createElement']} ElementConstructor
 */
/**
 * @typedef SetupResult
 * @property {ElementConstructor} createElement
 * Returns the custom element that is currently being rendered.
 */
/** @param {SetupOptions} [setupOptions] */
declare function setupInternal(setupOptions?: SetupOptions | undefined): {
    createElement: <Props_1 extends object = {}, ComponentData extends object = {}, DefaultProps extends object = {}>(elementConfig: ElementConfig<Props_1, DefaultProps, ComponentData> | (() => Template | Promise<Template>)) => Component<IsSubObject<DefaultProps, Props_1> extends true ? Props_1 : Merge<Props_1, DefaultProps>, ComponentData>;
};
