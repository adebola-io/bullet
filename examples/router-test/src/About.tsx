import { component, css } from '../../../library';

export default component({
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
