import { defineComponent, css } from '../../index.js';

const Counter = defineComponent({
  tag: 'my-counter',
  styles: css`
    .counter {
      font-size: 2rem;
      font-weight: bold;
    }
  `,

  /** @param {{'initial-count': number}} props */
  render: (props) => <div class="counter">0</div>,
});

document.querySelector('#root')?.append(<Counter initial-count={0} />);
