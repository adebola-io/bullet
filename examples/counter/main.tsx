import { createElement, css } from '@adbl/bullet';

interface CounterProps {
  initialCount?: number;
}

interface CounterData {
  count: number;
}

const Counter = createElement<CounterProps, CounterData>({
  defaultProps: {
    initialCount: 0,
  },

  data: () => {
    return {
      count: 0,
    };
  },

  render: (props, __, host) => {
    const decrement = () => {
      host.data.count--;
      host.render();
    };
    const increment = () => {
      host.data.count++;
      host.render();
    };

    return (
      <>
        <div class="Heading">
          <h1>Counter</h1>
          <p>A simple counter built in Bullet.</p>
        </div>
        <output>{host.data.count}</output>,
        <div class="ButtonRow">
          <button onClick={decrement} type="button">
            Decrement
          </button>
          <button id="name" onClick={increment} type="button">
            Increment
          </button>
        </div>
      </>
    );
  },

  styles: css`
    :host {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-family: sans-serif;
      border-radius: 13px;
      border: 2px solid #ccc;
      padding: 4rem 2rem;
      height: fit-content;
      width: fit-content;
      cursor: grab;
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
  <div
    style={{
      display: 'grid',
      placeItems: 'center',
      height: '100vh',
      width: '100vw',
    }}
  >
    <Counter />
  </div>
);
