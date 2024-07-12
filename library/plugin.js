/**
 * A plugin for transforming JSX/TSX files and configuring esbuild for Bullet.
 *
 * @typedef {Object} BulletPlugin
 * @property {string} name - The name of the plugin.
 * @property {function(string, string): Object|null} transform - Transforms JSX/TSX files.
 * @property {function(): Object} config - Provides esbuild configuration.
 */

/**
 * The Bullet plugin for Vite.
 *
 * This plugin handles the transformation of JSX and TSX files,
 * adding necessary imports and HMR support. It also configures
 * esbuild to use Bullet's JSX factory and fragment.
 *
 * @type {() => BulletPlugin}
 */
export const bullet = () => ({
  name: 'bullet-plugin',
  /**
   * @param {string} code
   * @param {string} id
   */
  transform(code, id) {
    if (id.endsWith('.jsx') || id.endsWith('.tsx')) {
      return {
        code: `
import { update as __BULLET_HMR__ } from '@adbl/bullet/library/hmr';
import { h as __bullet__jsx } from '@adbl/bullet/library/jsx-runtime'
const __bullet__jsxFragment = globalThis.DocumentFragment;

${code}

if (import.meta.hot) {
  import.meta.hot.accept((newModule) => {
    if (newModule) __BULLET_HMR__(newModule)
  });
}
`,
        map: null,
      };
    }
    return null;
  },
  config() {
    return {
      esbuild: {
        jsxFactory: '__bullet__jsx',
        jsxFragment: '__bullet__jsxFragment',
      },
    };
  },
});
