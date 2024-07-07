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
    - [`connected`](#connected)
    - [`disconnected`](#disconnected)
  - [Async components](#async-components)
    - [Loading and Error Handling](#loading-and-error-handling)
  - [Routing](#routing)
    - [Setting Up the Router](#setting-up-the-router)
    - [Route Configuration](#route-configuration)
    - [Implementing the Router](#implementing-the-router)
    - [Nested Routing with Inner Outlets](#nested-routing-with-inner-outlets)
    - [Lazy Loading Routes](#lazy-loading-routes)
    - [Programmatic Navigation](#programmatic-navigation)
    - [Dynamic Route Parameters](#dynamic-route-parameters)
    - [Wildcard Routes](#wildcard-routes)
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

You can define your own custom elements with the `createElement` function.
Here's an example of a simple component:

```jsx
import { createElement} from '@adbl/bullet';

const MyElement = createElement({
  tag: 'my-counter',
  render: () => <div>Hello, World!</div>
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

```jsx
document.body.append(<MyElement />);
```

### Usage without JSX

Bullet's JSX uses the standard HTML syntax and compile to regular DOM nodes, but you can use Bullet without it.

```js
import { createElement } from '@adbl/bullet';

const Box = createElement({
  tag: 'app-box',
  render: () => {
    const boxElement = document.createElement('div');
    boxElement.innerHTML = 'This is a box';
    return boxElement;
  },
});
```

You can also use the html template function to automatically parse strings:

```jsx
import { component, html } from '@adbl/bullet';

const Card = createElement({
  tag: 'product-card',
  render: (props) => html`
    <div class="card">
      <h1>${props.name}</h1>
      <img src=${props.imgSrc} alt=${props.imgAlt} />
    </div>
  `,
});
```

---

## Styling

Components can be styled using the `styles` property on the component object. All styles are generated as constructed stylesheets and are automatically scoped only to the parent web component.

```tsx
const Button = createElement({
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

```tsx
const Button = createElement({
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

```jsx
const Heading = createElement((props) => <h1>{props.text}</h1>);

document.body.append(<Heading text="Hello there" />);
```

---

## Event Handling

In Bullet, you can pass event handlers as props to components using the `on:` prefix. These event handlers will be automatically bound to the corresponding event on the component's root element.

```tsx
const Button = createElement({
  tag: 'my-button',
  render: (props) => (
    <button on:click={props.onButtonClick}>{props.label}</button>
  ),
});

const handleClick = () => {
  console.log('Button clicked!');
};

// Usage
<Button onButtonClick={handleClick} label="Click me" />;
```

In this example, the handleClick function is passed as the onButtonClick prop to the Button component. When the button is clicked, the handleClick function will be called, and "Button clicked!" will be logged to the console.

### Custom Events

More conventionally, Bullet also allows you to create and dispatch custom events from within your components. This can be useful for communicating between parent and child components, or for integrating with other libraries or frameworks that rely on custom events.

Example:

```tsx
const CustomEventComponent = createElement({
  tag: 'custom-event-component',
  render: function () {
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

### `connected`

The connected method is a lifecycle hook that is called when the component is mounted (inserted) into the DOM. This is a good place to perform side effects or initialize any resources that depend on the component being rendered.

Example:

```jsx
const MyComponent = createElement({
  tag: 'my-component',
  render: () => <div>Hello, World!</div>,
  connected: (props) => {
    console.log('Component mounted!');
    console.log('Component Props: ', props);
    // Perform side effects or initialize resources here
  },
});
```

In this example, when an instance of `<my-component>` is added to the DOM, the connected function will be called, and the message "Component mounted!" will be logged to the console, as well as props passed.

The connected method can optionally return a cleanup function, which will be called when the component is unmounted from the DOM.

```jsx
const MyComponent = createElement({
  tag: 'my-component',
  render: () => <div>Hello, World!</div>,
  connected: () => {
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

### `disconnected`

The `disconnected` method is a lifecycle hook that is called when the component is unmounted (removed) from the DOM. This is also a good place to perform cleanup tasks or release any resources that were initialized in the connected hook.

```jsx
const MyComponent = createElement({
  tag: 'my-component',
  render: () => <div>Hello, World!</div>,
  disconnected: () => {
    console.log('Component unmounted!');
    // Perform cleanup tasks or release resources here
  },
});
```

In this example, when an instance of `<my-component>` is removed from the DOM, the disconnected function will be called, and the message "Component unmounted!" will be logged to the console.

These lifecycle methods provide a way to hook into the component's lifecycle and perform actions at specific points, making it easier to manage side effects and resources within your components.

---

## Async components

You can define components that load asynchronously just by adding async before your render function.

```jsx
import { createElement } from '@adbl/bullet';

const Products = computed({
  tag: `products`,

  render: async () => {
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
document.body.append(<products></products>);
```

The component will be loaded on-demand when it is rendered.

### Loading and Error Handling

The `initial` method is used to define a placeholder template that will be created when the component is first rendered, before the asynchronous render method completes.

For example:

```tsx
const LoadingComponent = createElement({
  tag: 'loading-component',
  render: async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return <div>Content loaded!</div>;
  },
  initial: () => <div>Loading...</div>,
});
```

The `fallback` method is used to define a fallback template that will be rendered if the render method throws an error,or its Promise is rejected.

```tsx
const ErrorComponent = createElement({
  tag: 'error-component',
  render: async () => {
    throw new Error('Oops, something went wrong!');
  },
  fallback: (error) => <div>Error: {error.message}</div>,
});
```

In both cases, the initial and fallback methods provide a way to handle the different states of an asynchronous component, ensuring a better user experience by displaying appropriate content or error messages.

---

## Routing

Bullet includes a straightforward yet powerful routing system for single-page applications. This built-in functionality integrates seamlessly with Bullet components, allowing for dynamic page navigation.

### Setting Up the Router

To implement routing in your Bullet application, use the `createWebRouter` function:

```tsx
import {
  createWebRouter,
  type RouteRecords,
  createElement,
} from '@adbl/bullet';

// Define simple components
const Home = createElement({
  tag: 'home-page',
  render: () => <h1>Welcome to the Home Page</h1>,
});

const About = createElement({
  tag: 'about-page',
  render: () => <h1>About Us</h1>,
});

const NotFound = createElement({
  tag: 'not-found',
  render: () => <h1>404 - Page Not Found</h1>,
});

// Define routes
const routes: RouteRecords = [
  {
    name: 'home',
    path: '/',
    component: Home,
  },
  {
    name: 'about',
    path: '/about',
    component: About,
  },
  {
    name: 'not-found',
    path: '*',
    component: NotFound,
  },
];

// Create and mount the router
const router = createWebRouter({ routes });
document.body.appendChild(<router.Outlet />);
```

### Route Configuration

The `RouteRecords` type defines your application's route structure. Each route can include:

- `name`: A unique route identifier
- `path`: The URL path for the route
- `component`: The component to render for this route
- `children`: (Optional) Nested routes

### Implementing the Router

After creating a router, you can use it from within your elements with the `useRouter` hook. The router provides two essential custom elements:

1. `Link`: For creating navigation links
2. `Outlet`: Renders the current route's component

```jsx
import { createElement, useRouter } from '@adbl/bullet';

const App = createElement({
  tag: 'app-root',
  render: () => {
    const router = useRouter();
    const { Link, Outlet } = router;

    return (
      <div class="app">
        <nav>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
        </nav>
        <main>
          <Outlet />
        </main>
      </div>
    );
  },
});

export default App;
```

### Nested Routing with Inner Outlets

Bullet supports nested routing, allowing you to create more complex route structures with child routes. This is particularly useful for creating layouts with multiple levels of navigation or for organizing related routes.

To implement nested routing:

1. Define child routes in your route configuration:

```javascript
const routes: RouteRecords = [
  {
    name: 'dashboard',
    path: '/dashboard',
    component: Dashboard,
    children: [
      {
        name: 'overview',
        path: 'overview',
        component: Overview,
      },
      {
        name: 'stats',
        path: 'stats',
        component: Stats,
      },
    ],
  },
];
```

In your parent component (e.g., Dashboard), use an inner Outlet to render child routes:

```jsx
const Dashboard = createElement({
  tag: 'dashboard-page',
  render: () => {
    const router = useRouter();
    const { Link, Outlet } = router;

    return (
      <div>
        <h1>Dashboard</h1>
        <nav>
          <Link to="/dashboard/overview">Overview</Link>
          <Link to="/dashboard/stats">Stats</Link>
        </nav>
        <Outlet /> {/* This will render the active child route */}
      </div>
    );
  },
});
```

With this setup, when you navigate to `/dashboard/overview`, the Dashboard component will render, and its inner Outlet will display the Overview component. When you navigate to `/dashboard/stats`, the Dashboard component will still be rendered, but the inner Outlet will now display the Stats component.

### Lazy Loading Routes

Bullet supports lazy loading of route components for improved performance:

```javascript
const Settings = lazy(() => import('./Settings'));
```

This technique allows for code splitting and on-demand loading of components.

### Programmatic Navigation

For programmatic navigation, use the router's `navigate` method:

```jsx
const ProfileButton = createElement({
  render: () => {
    const router = useRouter();
    const goToProfile = () => router.navigate('/profile/123');

    return <button on:click={goToProfile}>View Profile</button>;
  },
});
```

### Dynamic Route Parameters

You can define routes with dynamic parameters:

```javascript
{
  name: 'profile',
  path: 'profile/:id',
  component: lazy(() => import('./Profile')),
}
```

Access these parameters in your component:

```jsx
const Profile = createElement({
  render() {
    const router = useRouter();
    const id = router.params.get('id');

    return <h1>Profile ID: {id}</h1>;
  },
});
```

### Wildcard Routes

Wildcard routes in Bullet offer powerful flexibility for handling various routing scenarios. They're particularly useful for handling 404 (Not Found) pages, error pages, and more.

```javascript
{
  name: 'not-found',
  path: '*',
  component: lazy(() => import('./NotFound')),
}
```

This routing system provides a robust foundation for creating single-page applications with Bullet. It offers easy navigation, code splitting capabilities, and flexible route configurations to suit various application needs.

---

## Why bullet?

Wow that's a great question.

## License

MIT, because why not?
