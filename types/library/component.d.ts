/**
 * @typedef {Node | string} AimRenderNode
 */
/**
 * @template {(...args: any[]) => any} Component
 * @typedef {Parameters<Component>[0]} ExtractPropTypes
 */
/**
 * @template {(...args: any[]) => any} Component
 * @typedef {{
 *    [K in keyof ExtractPropTypes<Component> as K extends `on:${infer L}` ? L : never]: ExtractPropTypes<Component>[K]
 * }} GetCustomEvents
 */
/**
 * @template {(...args: any[]) => any} Component
 * @template {keyof GetCustomEvents<Component>} EventName
 * @typedef {Required<GetCustomEvents<Component>>[EventName]} HandlerFor
 *
 * Extracts the type of an event handler from a component.
 *
 * ### Example
 * ```typescript
 * interface ComponentProps {
 *   'on:btn-click': (event: CustomEvent<MouseEvent>) => void
 * }
 *
 * // Define a component with a custom event
 * const MyComponent = createElement({
 *   tag: 'my-component',
 *
 *   render(props: ComponentProps) {
 *     const emitButtonClick = (event: MouseEvent) => {
 *       this.dispatchEvent(new CustomEvent('btn-click', { detail: event }));
 *     };
 *
 *     return <button on:click={emitButtonClick}>Click me</button>;
 *   }
 * });
 *
 * // Extract the type of the click event
 * type ButtonClickEventHandler = HandlerFor<typeof MyComponent, 'btn-click'>;
 *
 * // Use the extracted type for a function
 * const handleClick: ButtonClickEventHandler = (event) => { console.log(event); };
 * ```
 */
/**
 * @typedef {AimRenderNode | AimRenderNode[] | undefined} Template
 */
/**
 * @template Props
 * @typedef {Props & JSX.JSXNativeProps} ComponentProps
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
 * @property {string | Partial<CSSStyleDeclaration>} [styles]
 * The CSS styles to apply within the custom element. The styles are scoped to the custom element's shadow root.
 *
 * @property {string | Partial<CSSStyleDeclaration>} [globalStyles]
 * CSS styles that should be applied globally to the parent document. They are only valid as long as there is at least one
 * instance of the component in the document.
 *
 * @property {RenderFunction<ExtraData, RenderProps, DefaultProps, true>} render
 * A function that generates the content for the component's shadow root. It accepts the props of the component and the component data as arguments.
 *
 * @property {DefaultProps} [defaultProps]
 * Defines the default props for the custom element.
 *
 * @property {(props: keyof RenderProps extends never ? DefaultProps : RenderProps) => ExtraData & ThisType<BulletElement<ExtraData>>} [data]
 * Additional data for the custom element.
 *
 * @property {ThisType<BulletElement<ExtraData>> & ((props: keyof RenderProps extends never ? DefaultProps : RenderProps) => (void | (() => void)))} [connected]
 * Called when the component is mounted to the DOM.
 * It can optionally return a function that will be called when the component is unmounted from the DOM.
 *
 * @property {ThisType<BulletElement<ExtraData>> & (() => void)} [disconnected]
 * Called when the component is unmounted from the DOM.
 *
 * @property {(error: unknown, props: keyof RenderProps extends never ? DefaultProps : RenderProps, data: ExtraData) => Template} [fallback]
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
export const html: typeof generateChildNodes;
export const css: (template: {
    raw: readonly string[] | ArrayLike<string>;
}, ...substitutions: any[]) => string;
/**
 * @type {(setupOptions?: SetupOptions) => SetupResult}
 */
export const setup: (setupOptions?: SetupOptions) => SetupResult;
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
 * @returns {keyof Props extends never ? Component<Partial<DefaultProps>>: Component<Props>} A function that creates instances of the custom element.
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
export function createElement<RenderPropsInitial extends object, ComponentData extends object = {}, Props_1 extends object = RenderPropsInitial, DefaultProps extends object = {}, RenderProps extends Props & DefaultProps = Props & DefaultProps>(elementConfig: ElementConfig<Props_1 & DefaultProps & RenderProps, ComponentData, DefaultProps, RenderPropsInitial> | RenderFunction<ComponentData, RenderProps, DefaultProps, true>): keyof Props_1 extends never ? Component<Partial<DefaultProps>> : Component<Props_1>;
export type SetupOptions = {
    /**
     * A namespace to scope your custom elements to. This will ensure that they do not affect
     * other custom elements in the DOM.
     */
    namespace?: string | undefined;
};
export type ElementConstructor = ReturnType<typeof setupInternal>["createElement"];
export type SetupResult = {
    /**
     * Defines a custom HTML element with a shadow DOM and optional styles.
     */
    createElement: ElementConstructor;
};
export type AimRenderNode = Node | string;
export type ExtractPropTypes<Component extends (...args: any[]) => any> = Parameters<Component>[0];
export type GetCustomEvents<Component extends (...args: any[]) => any> = { [K in keyof ExtractPropTypes<Component> as K extends `on:${infer L}` ? L : never]: ExtractPropTypes<Component>[K]; };
/**
 * Extracts the type of an event handler from a component.
 *
 * ### Example
 * ```typescript
 * interface ComponentProps {
 *   'on:btn-click': (event: CustomEvent<MouseEvent>) => void
 * }
 *
 * // Define a component with a custom event
 * const MyComponent = createElement({
 *   tag: 'my-component',
 *
 *   render(props: ComponentProps) {
 *     const emitButtonClick = (event: MouseEvent) => {
 *       this.dispatchEvent(new CustomEvent('btn-click', { detail: event }));
 *     };
 *
 *     return <button on:click={emitButtonClick}>Click me</button>;
 *   }
 * });
 *
 * // Extract the type of the click event
 * type ButtonClickEventHandler = HandlerFor<typeof MyComponent, 'btn-click'>;
 *
 * // Use the extracted type for a function
 * const handleClick: ButtonClickEventHandler = (event) => { console.log(event); };
 * ```
 */
export type HandlerFor<Component extends (...args: any[]) => any, EventName extends keyof GetCustomEvents<Component>> = Required<GetCustomEvents<Component>>[EventName];
export type Template = AimRenderNode | AimRenderNode[] | undefined;
export type ComponentProps<Props_1> = Props_1 & JSX.JSXNativeProps;
export type Component<Props_1, Data = {}> = {
    tagName: string;
} & (keyof Props_1 extends never ? ((props?: {}) => BulletElement<{}>) : (props: ComponentProps<Props_1>) => BulletElement<Data>);
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
};
export type BulletElement<ComponentData = {}> = (HTMLElement & CustomElementProperties<ComponentData>);
export type RenderFunction<ExtraData, RenderProps, DefaultProps, Async extends boolean> = (this: BulletElement<ExtraData>, props: keyof RenderProps extends never ? DefaultProps : RenderProps, data: ExtraData) => Async extends true ? Template | Promise<Template> : Template;
export type ElementConfig<Props_1 extends DefaultProps = never, ExtraData extends object = never, DefaultProps extends Partial<Props_1> = {}, RenderProps extends object = Props_1> = {
    /**
     * The HTML tag name to use for the custom element.
     */
    tag?: string | undefined;
    /**
     * The CSS styles to apply within the custom element. The styles are scoped to the custom element's shadow root.
     */
    styles?: string | Partial<CSSStyleDeclaration> | undefined;
    /**
     * CSS styles that should be applied globally to the parent document. They are only valid as long as there is at least one
     * instance of the component in the document.
     */
    globalStyles?: string | Partial<CSSStyleDeclaration> | undefined;
    /**
     * A function that generates the content for the component's shadow root. It accepts the props of the component and the component data as arguments.
     */
    render: RenderFunction<ExtraData, RenderProps, DefaultProps, true>;
    /**
     * Defines the default props for the custom element.
     */
    defaultProps?: DefaultProps | undefined;
    /**
     * Additional data for the custom element.
     */
    data?: ((props: keyof RenderProps extends never ? DefaultProps : RenderProps) => ExtraData & ThisType<BulletElement<ExtraData>>) | undefined;
    /**
     * Called when the component is mounted to the DOM.
     * It can optionally return a function that will be called when the component is unmounted from the DOM.
     */
    connected?: (ThisType<BulletElement<ExtraData>> & ((props: keyof RenderProps extends never ? DefaultProps : RenderProps) => (void | (() => void)))) | undefined;
    /**
     * Called when the component is unmounted from the DOM.
     */
    disconnected?: (ThisType<BulletElement<ExtraData>> & (() => void)) | undefined;
    /**
     * If the render function throws an error, this function will be called to render a fallback template for the component.
     * It is most useful for asynchronous rendering, where the render function returns a promise that may be rejected.
     */
    fallback?: ((error: unknown, props: keyof RenderProps extends never ? DefaultProps : RenderProps, data: ExtraData) => Template) | undefined;
    /**
     * A function that generates a starting template for the component. It will be render as a placeholder if the `render()` function
     * is async, and is yet to be resolved.
     */
    initial?: RenderFunction<ExtraData, RenderProps, DefaultProps, false> | undefined;
    /**
     * Whether or not the component is associated with a form.
     */
    formAssociated?: boolean | undefined;
};
import { generateChildNodes } from './utils.js';
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
declare function setupInternal(setupOptions?: SetupOptions | undefined): {
    createElement: <RenderPropsInitial extends object, ComponentData extends object = {}, Props_1 extends object = RenderPropsInitial, DefaultProps extends object = {}, RenderProps extends Props & DefaultProps = Props & DefaultProps>(elementConfig: ElementConfig<Props_1 & DefaultProps & RenderProps, ComponentData, DefaultProps, RenderPropsInitial> | RenderFunction<ComponentData, RenderProps, DefaultProps, true>) => keyof Props_1 extends never ? Component<Partial<DefaultProps>> : Component<Props_1>;
};
export {};
