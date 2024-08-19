/// <reference types="vite/client" />

import { css, setup } from '@adbl/bullet';
import styles from './styles/tailwind.css?inline';
import './styles/global.css';

export const { createElement } = setup({
  namespace: 'bullet-tailwind',
  styles: css(styles),
});
