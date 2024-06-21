import { defineConfig } from 'vite';

export default defineConfig({
  esbuild: {
    jsxFactory: '__aim__jsx',
    jsxFragment: '__aim__jsxFragment',
  },
});
