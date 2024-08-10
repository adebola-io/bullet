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
export const bullet: () => BulletPlugin;
/**
 * A plugin for transforming JSX/TSX files and configuring esbuild for Bullet.
 */
export type BulletPlugin = {
    /**
     * - The name of the plugin.
     */
    name: string;
    /**
     * - Transforms JSX/TSX files.
     */
    transform: (arg0: string, arg1: string) => Object | null;
    /**
     * - Provides esbuild configuration.
     */
    config: () => Object;
};
export type BulletPluginOptions = {
    /**
     * - The aliasing path for the bullet library.
     */
    alias?: string | undefined;
};
