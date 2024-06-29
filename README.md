# bullet

A tiny, experimental, and ill-advised library for Web Components.

[![downloads (@adb/bullet)](https://img.shields.io/npm/dm/@adbl/bullet?label=downloads)](https://www.npmjs.com/package/@adbl/bullet)

> Exploratory and experimental. If you use it, you're on your own. If you want to use web components in a production setting, use Lit.

<!-- TOC -->

- [bullet](#bullet)
  - [Installation](#installation)
  - [JSX Support](#jsx-support)
  - [Usage](#usage)
    - [Usage without JSX](#usage-without-jsx)
  - [Styling](#styling)
  - [Anonymous components](#anonymous-components)
  - [Event Handling](#event-handling)
    - [Custom Events](#custom-events)
  - [Lifecycle Methods](#lifecycle-methods)
    - [onMounted](#onmounted)
    - [onUnMounted](#onunmounted)
  - [Async components](#async-components)
    - [Loading and Error Handling](#loading-and-error-handling)
  - [Why bullet?](#why-bullet)
  - [License](#license)

<!-- /TOC -->
<!-- /TOC -->
<!-- /TOC -->
<!-- /TOC -->
<!-- /TOC -->

---

## Installation

If you're feeling adventurous/reckless, you can install bullet with your favorite package manager:

```shell
npm install @adbl/bullet
# or
yarn add @adbl/bullet
```

---

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
import '@adbl/bullet/library/jsx-runtime.js';
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

---

## Styling

Components can be styled using the `styles` property on the component object. All styles are generated as constructed stylesheets and are automatically scoped only to the parent web component.

```ts
const Button = component({
  tag: 'my-button',
  render: (props) => <button>{props.label}</button>,

  styles: `
    button {
      background-color: red;
      color: white;
      border-radius: 1rem;
      padding: 4rem 8rem;
    }
  `,
});
```

By default, the button styles will only apply to buttons within the `Button` component. If you want to define styles that can apply to the whole document, you can use the `globalStyles` property instead:

```ts
const Button = component({
  tag: 'my-button',
  render: (props) => <button>{props.label}</button>,

  styles: `
    button {
      background-color: red;
      color: white;
      border-radius: 1rem;
      padding: 4rem 8rem;
    }
`,

  globalStyles: `
    body {
      font-family: sans-serif;
      background-color: black;
    }
`,
});
```

Whenever there is at least one instance of the component in the DOM, the document body will apply the given styles.

---

## Anonymous components

You can also declare custom elements without tag names, meaning the tag names will be auto-generated:

```js
const Heading = component((props) => <h1>{props.text}</h1>);

document.body.append(<Heading text="Hello there" />);
```

---

## Event Handling

In Bullet, you can pass event handlers as props to components using the `on:`s prefix. These event handlers will be automatically bound to the corresponding event on the component's root element.

```tsx
const Button = component({
  tag: 'my-button',
  render: (props) => <button on:click={props.click}>{props.label}</button>,
});

const handleClick = () => {
  console.log('Button clicked!');
};

// Usage
<Button click={handleClick} label="Click me" />;
```

In this example, the handleClick function is passed as the onClick prop to the Button component. When the button is clicked, the handleClick function will be called, and "Button clicked!" will be logged to the console.

### Custom Events

More conventionally, Bullet also allows you to create and dispatch custom events from within your components. This can be useful for communicating between parent and child components, or for integrating with other libraries or frameworks that rely on custom events.

Example:

```tsx
const CustomEventComponent = component({
  tag: 'custom-event-component',
  render: () => {
    const handleClick = () => {
      const event = new CustomEvent('custom', {
        detail: { message: 'Hello, World!' },
      });
      this.dispatchEvent(event);
    };

    return <button on:click={handleClick}>Dispatch Event</button>;
  },
});
```

// Usage

```tsx
const logMessage = (event) => {
  console.log(event.detail.message); // Output: "Hello, World!"
};
const myComponent = <CustomEvent on:custom={logMessage} />;
document.body.append(myComponent);
```

In this example, the CustomEvent component defines a handleClick function that creates a new CustomEvent with a detail object containing a message. When the button is clicked, the custom event is dispatched using this.dispatchEvent(event).

To listen for the custom event, you can also use the addEventListener method on the component instance, just like you would with a regular DOM element.

---

## Lifecycle Methods

### onMounted

The onMounted method is a lifecycle hook that is called when the component is mounted (inserted) into the DOM. This is a good place to perform side effects or initialize any resources that depend on the component being rendered.

Example:

```jsx
const MyComponent = component({
  tag: 'my-component',
  render: () => <div>Hello, World!</div>,
  onMounted: function (props) {
    console.log('Component mounted!');
    console.log('Component Props: ', props);
    // Perform side effects or initialize resources here
  },
});
```

In this example, when an instance of `<bt-my-component>` is added to the DOM, the onMounted function will be called, and the message "Component mounted!" will be logged to the console, as well as props passed.

The onMounted method can optionally return a cleanup function, which will be called when the component is unmounted from the DOM.

```jsx
const MyComponent = component({
  tag: 'my-component',
  render: () => <div>Hello, World!</div>,
  onMounted: function () {
    const interval = setInterval(() => {
      console.log('Interval running...');
    }, 1000);

    return () => {
      clearInterval(interval);
      console.log('Interval cleared!');
    };
  },
});
```

### onUnMounted

The onUnMounted method is a lifecycle hook that is called when the component is unmounted (removed) from the DOM. This is also a good place to perform cleanup tasks or release any resources that were initialized in the onMounted hook.

```jsx
const MyComponent = component({
  tag: 'my-component',
  render: () => <div>Hello, World!</div>,
  onUnMounted: function () {
    console.log('Component unmounted!');
    // Perform cleanup tasks or release resources here
  },
});
```

In this example, when an instance of `<bt-my-component>` is removed from the DOM, the onUnMounted function will be called, and the message "Component unmounted!" will be logged to the console.

These lifecycle methods provide a way to hook into the component's lifecycle and perform actions at specific points, making it easier to manage side effects and resources within your components.

---

## Async components

You can define components that load asynchronously just by adding async before your render function.

```jsx
import { component } from '@adbl/bullet';

const Products = computed({
  tag: `products`,

  async render() {
    const res = await fetch('https://dummyjson.com/products');
    const data = await res.json();
    const { products } = data;

    return (
      <ul>
        {data.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    );
  },
});
```

You can then use `Products` anywhere just like a regular component:

```tsx
document.body.append(<bt-products></bt-products>);
```

The component will be loaded on-demand when it is rendered.

### Loading and Error Handling

The `initial` method is used to define a placeholder template that will be created when the component is first rendered, before the asynchronous render method completes.

For example:

```ts
const LoadingComponent = component({
  tag: 'loading-component',
  async render() {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return <div>Content loaded!</div>;
  },
  initial: () => <div>Loading...</div>,
});
```

The `fallback` method is used to define a fallback template that will be rendered if the render method throws an error,or its Promise is rejected.

```ts
const ErrorComponent = component({
  tag: 'error-component',
  async render() {
    throw new Error('Oops, something went wrong!');
  },
  fallback: (error) => <div>Error: {error.message}</div>,
});
```

In both cases, the initial and fallback methods provide a way to handle the different states of an asynchronous component, ensuring a better user experience by displaying appropriate content or error messages.

## Why bullet?

Wow that's a great question.

## License

MIT, because why not?
