import { getWindowContext } from './shim.js';

/**
 * CSSText class represents a CSS stylesheet that can be created and manipulated.
 * It allows setting CSS text and creating a browser stylesheet from it.
 */
export class CSSText {
  /**
   * @type {WeakRef<CSSStyleSheet> | undefined}
   * A weak reference to the associated CSSStyleSheet.
   */
  styleSheet = undefined;

  /**
   * @type {string}
   * The raw CSS text.
   */
  raw = '';

  /**
   * Constructs a CSSText instance with optional initial CSS text.
   * @param {string} [css] - Initial CSS text to set.
   */
  constructor(css) {
    if (css) {
      this.raw = css;
    }
  }

  /**
   * Creates a browser stylesheet from the CSS text.
   * @returns {CSSStyleSheet} - The created CSSStyleSheet.
   */
  getSheet() {
    const styleSheet = this.styleSheet?.deref();
    if (styleSheet) {
      return styleSheet;
    }

    const window = getWindowContext();
    const sheet = new window.CSSStyleSheet();
    sheet.replaceSync(this.raw);

    this.styleSheet = new WeakRef(sheet);
    return sheet;
  }
}

/**
 * @typedef {string
 *  | TemplateStringsArray
 *  | Promise<string | {default: string}>
 *  | Array<string | TemplateStringsArray | Promise<string | {default: string}>>
 * } CSSorStringArray
 * A CSS or string array.
 */

/**
 * Generates a CSS stylesheet from a CSS text string.
 *
 * @param {CSSorStringArray} template - The CSS text to create the stylesheet from.
 * @param {any[]} substitutions
 * @returns {Array<CSSText>} - The generated CSS stylesheet.
 */
export const css = (template, ...substitutions) => {
  switch (true) {
    case typeof template === 'string': {
      const stylesheet = new CSSText(template);
      return [stylesheet];
    }
    case template instanceof Promise: {
      const stylesheet = new CSSText();
      template.then((imported) => {
        const data = typeof imported === 'string' ? imported : imported.default;
        stylesheet.raw = data;
      });
      return [stylesheet];
    }
    case Array.isArray(template): {
      const data = [];
      for (const temp of template) {
        data.push(...css(temp));
      }
      return data;
    }
    default: {
      const stylesheet = new CSSText();
      const cssText = String.raw(template, ...substitutions);
      stylesheet.raw = cssText;
      return [stylesheet];
    }
  }
};
