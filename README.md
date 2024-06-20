# bullet

A tiny, experimental, and ill-advised library for defining and using Web Components.

> Exploratory and experimental. If you use it, you're on your own. If you want to use web components in a production setting, use Lit.

## Installation

If you're feeling adventurous/reckless, you can install bullet with your favorite package manager:

```shell
npm install @adbl/bullet
# or
yarn add @adbl/bullet
```

## Usage

You can define your own custom elements with the `defineComponent` function.
Here's an example of a simple counter component:

```js
import { defineComponent, css, html } from '@adbl/bullet';

const Counter = defineComponent({
  tag: 'my-counter',
  styles: css`
    .counter {
      font-size: 2rem;
      font-weight: bold;
    }
  `,

  data: {
    count: 0,

    increment() {
      this.data.count++;
      this.get('.counter').textContent = this.data.count;
    },

    decrement() {
      this.data.count--;
      this.get('.counter').textContent = this.data.count;
    },
  },

  render(props, data) {
    return html`
      <div class="counter">${data.count}</div>
      <button onclick="${data.increment}">Increment</button>
      <button onclick="${data.decrement}">Decrement</button>
    `;
  },
});
```

You can then use your custom element like any other HTML tag:

```html
<body>
  <my-counter></my-counter>
  <script type="module">
    import { Counter } from './counter.js';
  </script>
</body>
```

or you can instantiate the constructor in javascript:

```js
document.body.append(Counter());
```

## Why bullet?

Wow that's a great question.

## License

MIT, because why not?
