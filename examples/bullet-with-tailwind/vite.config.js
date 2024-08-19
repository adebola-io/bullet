import { defineConfig } from 'vite';
import { bullet } from '@adbl/bullet/library/plugin';

export default defineConfig({
  plugins: [bullet()],
});
