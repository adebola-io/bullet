import { createElement } from './';

export const test = createElement({
  tag: 'test-document',
  render() {
    return <div>Hello</div>;
  },
});
