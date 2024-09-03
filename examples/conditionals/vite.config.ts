import { defineConfig } from 'vite';
import { bullet } from '@adbl/bullet/library/plugin';
import path from 'node:path';

export default defineConfig({
  plugins: [bullet()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './source'),
    },
  },
});