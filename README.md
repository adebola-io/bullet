# bullet 〰️

A tiny, experimental, and ill-advised library for Web Components.

> Exploratory and experimental. If you use it, you're on your own. If you want to use web components in a production setting, use Lit.

## Installation

If you're feeling adventurous/reckless, you can install bullet with your favorite package manager:

```shell
npm install @adbl/bullet
# or
yarn add @adbl/bullet
```

## JSX Support

If you wish to use the JSX syntax in a Vite project, create a `vite.config.js` file with the following:

```js
import { defineConfig } from 'vite';

export default defineConfig({
  esbuild: {
    jsxFactory: '__bullet__jsx',
    jsxFragment: '__bullet__jsxFragment',
  },
});
```

In your `tsconfig.json` or `jsconfig.json` file, add the compiler option:

```json
  "jsx": "preserve"
```

Lastly, at the entry file to your project, add the following at the very top:

```js
import '@adbl/bullet/library/jsx-runtime';
```

## Usage

You can define your own custom elements with the `component` function.
Here's an example of a simple component:

```js
import { component } from '@adbl/bullet';

const MyElement = component({
  tag: 'my-counter',
  render: () => <div>Hello, World!</div>)
});
```

You can then use your custom element like any other HTML tag:

```html
<body>
  <bt-my-counter></bt-my-counter>
  <script type="module">
    import { Counter } from './counter.js';
  </script>
</body>
```

or you can instantiate the constructor in javascript:

```js
document.body.append(<MyElement />);
```

### Usage without JSX

Bullet's JSX uses the standard HTML syntax and compile to regular DOM nodes, but you can use Bullet without it.

```js
import { component } from '@adbl/bullet';

const Box = component({
  tag: 'app-button',
  render() {
    const boxElement = document.createElement('div');
    button.innerHTML = 'This is a box';
    return box;
  },
});
```

You can also use the html template function to automatically parse strings:

```js
import { component, html } from '@adbl/bullet';

const Card = component({
  tag: 'app-product-card',
  render: (props) => {
    return html`
      <div class="card">
        <h1>${props.name}</h1>
        <img src=${props.imgSrc} alt=${props.imgAlt} />
      </div>
    `;
  },
});
```

### Styling

Components can be styled using the `styles` property on the component object. All styles are generated as constructed stylesheets and are automatically scoped only to the parent web component.

```ts
const Button = component({
  tag: 'my-button',
  render: (props) => <button>{props.label}</button>

  styles:  `
    button {
      background-color: red;
      color: white;
      border-radius: 1rem;
      padding: 4rem 8rem;
    }
  `
});
```

By default, the button styles will only apply to buttons within the `Button` component.

### Anonymous components

You can also declare custom elements without tag names, meaning the tag names will be auto-generated:

```js
const Heading = component((props) => <h1>{props.text}</h1>);

document.body.append(<Heading text="Hello there" />);
```

## Why bullet?

Wow that's a great question.

## License

MIT, because why not?
