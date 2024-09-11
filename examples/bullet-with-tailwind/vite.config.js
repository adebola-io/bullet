import { defineConfig } from 'vite';
import { bullet } from '@adbl/bullet/plugin';

export default defineConfig({
  plugins: [bullet()],
});
