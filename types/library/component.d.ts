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
export function component<RenderPropsInitial extends object, ComponentData extends object = {}, Props_1 extends object = RenderPropsInitial, DefaultProps extends object = {}, RenderProps extends Props & DefaultProps = Props & DefaultProps>(elementConfig: ElementConfig<Props_1 & DefaultProps & RenderProps, ComponentData, DefaultProps, RenderPropsInitial> | RenderFunction<ComponentData, RenderProps, DefaultProps>): keyof Props_1 extends never ? Component<Partial<DefaultProps>> : Component<Props_1>;
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
 * @typedef {{
 *  tag?: string,
 *  styles?: string | Partial<CSSStyleDeclaration>,
 *  render: RenderFunction<ExtraData, RenderProps, DefaultProps>,
 *  defaultProps?: DefaultProps,
 *  data?: (props: keyof RenderProps extends never ? DefaultProps : RenderProps) => ExtraData & ThisType<BulletElement<ExtraData>>
 * }} ElementConfig
 */
export const html: typeof generateChildNodes;
export const css: (template: {
    raw: readonly string[] | ArrayLike<string>;
}, ...substitutions: any[]) => string;
export type AimRenderNode = Node | string;
export type Template = AimRenderNode | AimRenderNode[];
export type Component<Props_1> = {
    componentId?: string;
} & (keyof Props_1 extends never ? ((props?: {}) => BulletElement<{}>) : (props: Props_1) => BulletElement<{}>);
export type BulletElement<ComponentData> = (HTMLElement & {
    data: ComponentData;
    select: Element["querySelector"];
    selectAll: Element["querySelectorAll"];
});
export type RenderFunction<ExtraData, RenderProps, DefaultProps> = (this: BulletElement<ExtraData>, props: keyof RenderProps extends never ? DefaultProps : RenderProps, data: ExtraData) => Template | Promise<Template>;
export type ElementConfig<Props_1 extends DefaultProps = never, ExtraData extends object = never, DefaultProps extends Partial<Props_1> = {}, RenderProps extends object = Props_1> = {
    tag?: string;
    styles?: string | Partial<CSSStyleDeclaration>;
    render: RenderFunction<ExtraData, RenderProps, DefaultProps>;
    defaultProps?: DefaultProps;
    data?: (props: keyof RenderProps extends never ? DefaultProps : RenderProps) => ExtraData & ThisType<BulletElement<ExtraData>>;
};
import { generateChildNodes } from './utils.js';
