type NativeElement = Element;

declare namespace JSX {
  export type ToJSX<T extends Element> = Partial<
    Omit<T, 'className' | 'children'> & {
      class: T['className'];
      children: Node;
    }
  >;

  export type IntrinsicElements = {
    [K in keyof HTMLElementTagNameMap]: ToJSX<HTMLElementTagNameMap[K]>;
  };

  export type Element = NativeElement;
}
