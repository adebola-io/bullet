import { setup } from '../../../library';

export const { createElement } = setup({
  namespace: 'app',
  stylesheets: Array.from(document.styleSheets),
});
