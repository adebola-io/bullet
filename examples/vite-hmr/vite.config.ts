import { defineConfig, type Plugin } from 'vite';
import { bullet } from '../../library/plugin';

export default defineConfig({
  plugins: [bullet()],
});
