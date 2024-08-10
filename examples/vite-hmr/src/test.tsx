import { createElement } from '../../../index.js';

export const test = createElement({
  tag: 'test-document',
  render() {
    return <div>Hello</div>;
  },
});
