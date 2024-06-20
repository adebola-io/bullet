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
export function defineComponent<ComponentData extends object, TagName_1 extends string = string, Props_1 extends object = never>(elementConfig: ElementConfig<TagName_1, Props_1, ComponentData>): ComponentConstructor<TagName_1, ReplaceConstructors<Props_1>, ComponentData>;
export const html: (template: {
    raw: readonly string[] | ArrayLike<string>;
}, ...substitutions: any[]) => string;
export const css: (template: {
    raw: readonly string[] | ArrayLike<string>;
}, ...substitutions: any[]) => string;
export type AimRenderNode = Element | DocumentFragment | string;
export type Template = AimRenderNode | AimRenderNode[];
export type ComponentConstructor<TagName_1 extends string, Props_1, ComponentData> = {
    componentId?: string;
} & ((props?: Props_1) => AimElement<ComponentData>);
export type AimElement<ComponentData> = (HTMLElement & {
    data: ComponentData;
    get: Document["querySelector"];
});
export type ElementConfig<TagName_1 extends string, Props_1 extends object = never, ExtraData extends object = never> = {
    tag: TagName_1;
    styles?: string | Partial<CSSStyleDeclaration>;
    render: (props: ReplaceConstructors<Props_1>, data: ExtraData) => Template;
    defaultProps?: Props_1;
    data?: ExtraData & ThisType<AimElement<ExtraData>>;
};
export type ReplaceConstructors<T extends object> = { [K in keyof T]: T[K] extends new (...args: any) => infer U ? U extends string ? string : U extends boolean ? boolean : U extends number ? number : U : T[K]; };
