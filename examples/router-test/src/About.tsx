import { css } from '../../../library';
import { createElement } from './setup';

export default createElement({
  tag: 'about-page',

  render() {
    return <div>This is the about Page</div>;
  },

  styles: css`
    div {
      display: flex;
      justify-content: center;
      align-items: center;
      height: var(--page-height);
    }
  `,
});
