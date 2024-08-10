import { defineConfig } from 'vite';
import { bullet } from '../../library/plugin.js';

export default defineConfig({
  esbuild: {
    jsxFactory: '__bullet__jsx',
    jsxFragment: '__bullet__jsxFragment',
  },
  plugins: [
    bullet({
      alias: '../..',
    }),
  ],
});
