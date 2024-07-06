import { defineConfig } from 'vite';

export default defineConfig({
  esbuild: {
    jsxFactory: '__bullet__jsx',
    jsxFragment: '__bullet__jsxFragment',
  },
});
