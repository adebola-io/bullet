import { createElement } from '@/setup';

import { For, If } from '@adbl/bullet';
import { Cell } from '@adbl/cells';

interface Item {
  id: string;
  text: string;
}

const shouldShowHeading = Cell.source(true);
const list = Cell.source([
  {
    id: '1',
    text: 'Hello',
  },
  {
    id: '2',
    text: 'World',
  },
] as Item[]);

function handleSubmit(event: Event) {
  event.preventDefault();
  const target = event.target as HTMLFormElement;
  const input = target.querySelector('input') as HTMLInputElement;
  if (!input?.value) return;

  list.value.push({
    id: Math.random().toString(36).slice(2),
    text: input.value,
  });
  input.value = '';
}

export const App = createElement({
  tag: 'app-root',
  render: () => (
    <main>
      <h1>
        {If(shouldShowHeading, () => {
          return <span class="gradient-text">bullet.</span>;
        })}
        <br />
        <button
          type="button"
          onClick={() => {
            shouldShowHeading.value = !shouldShowHeading.value;
          }}
        >
          Hide Heading.
        </button>
      </h1>

      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Enter text..." />
        <button type="submit">Add</button>
      </form>
      <ul>
        {For(list, (item) => {
          return <li>{item.text}</li>;
        })}
      </ul>
    </main>
  ),
});
