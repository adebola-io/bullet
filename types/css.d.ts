/**
 * CSSText class represents a CSS stylesheet that can be created and manipulated.
 * It allows setting CSS text and creating a browser stylesheet from it.
 */
export class CSSText {
    /**
     * Constructs a CSSText instance with optional initial CSS text.
     * @param {string} [css] - Initial CSS text to set.
     */
    constructor(css?: string | undefined);
    /**
     * @type {WeakRef<CSSStyleSheet> | undefined}
     * A weak reference to the associated CSSStyleSheet.
     */
    styleSheet: WeakRef<CSSStyleSheet> | undefined;
    /**
     * @type {string}
     * The raw CSS text.
     */
    raw: string;
    /**
     * Creates a browser stylesheet from the CSS text.
     * @returns {CSSStyleSheet} - The created CSSStyleSheet.
     */
    getSheet(): CSSStyleSheet;
}
export function css(template: CSSorStringArray, ...substitutions: any[]): Array<CSSText>;
/**
 * A CSS or string array.
 */
export type CSSorStringArray = string | TemplateStringsArray | Promise<string | {
    default: string;
}> | Array<string | TemplateStringsArray | Promise<string | {
    default: string;
}>>;
