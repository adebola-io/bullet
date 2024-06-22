import { component, css } from '../../index.js';
import { Signal } from '@adbl/signals';

const Counter = component({
  render() {
    const count = Signal.source(0);
    count.createEffect((newCount) => {
      const output = this.select('output') as HTMLOutputElement;
      output.textContent = `${newCount}`;
    });

    return [
      <div class="Heading">
        <h1>Counter</h1>
        <p>A simple counter built in Bullet.</p>
      </div>,
      <output>{count.value}</output>,
      <div class="ButtonRow">
        <button onclick={() => count.value--} type="button">
          Decrement
        </button>
        <button onclick={() => count.value++} type="button">
          Increment
        </button>
      </div>,
    ];
  },

  styles: css`
    :host {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-family: sans-serif;
      border-radius: 13px;
      border: 2px solid #ccc;
      padding: 4rem 2rem;
    }

    .Heading {
      text-align: center;
    }

    h1 {
      font-size: 2rem;
      font-weight: bold;
      margin: 0;
    }

    output {
      font-size: 6rem;
      font-weight: bold;
      margin-bottom: 1rem;
    }

    .ButtonRow {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    button {
      font-size: 1.5rem;
      padding: 0.5rem 1rem;
      margin: 0 0.5rem;
      border-radius: 0.5rem;
      background-color: #f0f0f0;
      border: 1px solid #ccc;
      transition-duration: 0.2s;
    }

    button:hover {
      background-color: gainsboro;
      scale: 0.98;
    }
  `,
});

document.body.appendChild(
  <div style={{ display: 'grid', placeContent: 'center', height: '100vh' }}>
    <Counter />
  </div>
);
