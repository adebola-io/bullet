// @bullet-resolve-ignore
// @ts-nocheck
/// <reference types="node" />

import { resolve } from 'node:path';

/**
 * A plugin for transforming JSX/TSX files and configuring esbuild for Bullet.
 *
 * @typedef {Object} BulletPlugin
 * @property {string} name - The name of the plugin.
 * @property {function(string, string): Object|null} transform - Transforms JSX/TSX files.
 * @property {function(): Object} config - Provides esbuild configuration.
 */

/**
 * @typedef {Object} BulletPluginOptions
 * @property {string} [alias] - The aliasing path for the bullet library.
 */

/**
 * The Bullet plugin for Vite.
 *
 * This plugin handles the transformation of JSX and TSX files,
 * adding necessary imports and HMR support. It also configures
 * esbuild to use Bullet's JSX factory and fragment.
 *
 * @type {() => BulletPlugin}
 * @param {BulletPluginOptions} [options]
 */
export const bullet = (options) => ({
  name: 'bullet-plugin',
  /**
   * @param {string} code
   * @param {string} id
   */
  transform(code, id) {
    const alias = options?.alias ? resolve(options.alias) : '@adbl/bullet';

    const shouldWatchFile =
      id.endsWith('.jsx') ||
      id.endsWith('.tsx') ||
      id.endsWith('.js') ||
      id.endsWith('.ts');

    // @ts-ignore
    if (
      code.startsWith('// @bullet-resolve-ignore') ||
      !id.startsWith(process.cwd())
    ) {
      return null;
    }

    if (code.includes('update as __BULLET_HMR__')) {
      return null;
    }

    if (shouldWatchFile && !id.startsWith(alias)) {
      return {
        code: `
import { update as __BULLET_HMR__ } from '${alias}/library/hmr';
import { h as __bullet__jsx, DocumentFragmentPlaceholder as __bullet__jsxFragment } from '${alias}/library/jsx-runtime'

${code}

if (import.meta.hot) {
  import.meta.hot.accept((newModule) => {
    if (newModule) {
      const updated = __BULLET_HMR__(newModule);
      if (!updated) window.location.reload();
    }
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
