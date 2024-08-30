# bullet

A tiny, experimental, and ill-advised library for Web Components.

[![downloads (@adb/bullet)](https://img.shields.io/npm/dm/@adbl/bullet?label=downloads)](https://www.npmjs.com/package/@adbl/bullet)

> Exploratory and experimental. If you use it, you're on your own. If you want to use web components in a production setting, use Lit.

<!-- TOC -->

- [bullet](#bullet)
  - [Installation](#installation)
  - [Usage](#usage)
    - [JSX Syntax](#jsx-syntax)
    - [Usage without JSX](#usage-without-jsx)
  - [Styling](#styling)
  - [Importing External Stylesheets](#importing-external-stylesheets)
  - [Attributes](#attributes)
  - [Anonymous components](#anonymous-components)
  - [Event Handling](#event-handling)
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

---

## Installation

To create a new Bullet project, you can use the Bullet CLI tool. Make sure you have Node.js version 14.0.0 or higher installed on your system.

1. Run the following command to create a new Bullet project:

   ```bash
   npx create-bullet-app
   ```

2. Follow the prompts to configure your project.

3. Once the project is created, navigate to the project directory:

   ```bash
   cd your-project-name
   ```

4. Install the project dependencies:

   ```bash
   npm install
   ```

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open your browser and visit `http://localhost:5173` to see your new Bullet app in action!

Now you're ready to start building your app with Bullet. Happy coding! 🚀

## Usage

You can define your own custom elements with the `createElement` function.
Here's an example of a simple component:

```jsx
// my-element.js
const MyElement = createElement({
  tag: 'my-element',
  render: () => 'Hello, World!',
});
```

You can then use your custom element like any other HTML tag:

```html
<!-- index.html -->
<body>
  <my-element></my-element>
  <script type="module">
    import { MyElement } from './my-element.js';
  </script>
</body>
```

or you can instantiate the constructor in javascript:

```jsx
document.body.append(MyElement());
```

### JSX Syntax

JSX is a syntax extension for JavaScript that allows you to write HTML-like code within your JavaScript files. It is most famously used with React to describe the structure and appearance of UI components.

Bullet supports a similar syntax, and compiles to regular DOM nodes.

```jsx
import { createElement } from '@adbl/bullet';

const Greeting = createElement({
  tag: 'app-greeting',
  render: (props) => (
    <div>
      <h1>Hello, {props.name}!</h1>
      <p>Welcome to Bullet</p>
    </div>
  ),
});

// Usage
document.body.append(<Greeting name="World" />);
```

JSX is transpiled to regular JavaScript function calls and objects before being executed in the browser.

### Usage without JSX

Since the JSX is syntactic sugar for regular JavaScript, you can use Bullet without it.

```js
import { createElement } from '@adbl/bullet';

const Greeting = createElement({
  tag: 'app-greeting',
  render: (props) => {
    const greetingElement = document.createElement('div');
    const headingElement = document.createElement('h1');
    const paragraphElement = document.createElement('p');

    headingElement.innerHTML = `Hello, ${props.name}!`;
    paragraphElement.innerHTML = 'Welcome to Bullet';

    greetingElement.appendChild(headingElement);
    greetingElement.appendChild(paragraphElement);
    return greetingElement;
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

Components can be styled using the `styles` property on the component object, and the `css` function, which can be used to generate CSS stylesheets. All styles are generated as constructed stylesheets and are automatically scoped only to the given element.

```tsx
import { createElement, css } from '@adbl/bullet';

const AppButton = createElement({
  tag: 'app-button',
  render: (props) => <button>{props.label}</button>,

  styles: css`
    button {
      background-color: red;
      color: white;
      border-radius: 1rem;
      padding: 4rem 8rem;
    }
  `,
});
```

By default, the button styles will only apply to the button within the `AppButton` element. If you want to define styles that can apply to the whole document, you can use the `globalStyles` property instead:

```tsx
import { createElement, css } from '@adbl/bullet';

const AppButton = createElement({
  tag: 'app-button',
  render: (props) => <button>{props.label}</button>,

  styles: css`
    button {
      background-color: red;
      color: white;
      border-radius: 1rem;
      padding: 4rem 8rem;
    }
  `,

  globalStyles: css`
    body {
      font-family: sans-serif;
      background-color: black;
    }
  `,
});
```

Whenever there is at least one instance of the component in the DOM, the document body will apply the given styles.

## Importing External Stylesheets

Bullet also supports importing external CSS files directly into your components. This can be particularly useful for organizing your styles or when working with existing CSS files. To import an external stylesheet, you can use the `?inline` query parameter in your import statement.

Here's an example of how to import and use an external CSS file in your Bullet component:

```css
/* my-component/styles.css */
:host {
  width: 100px;
  height: 100px;
  background-color: red;
}
```

```tsx
/* my-component/index.tsx */
import { createElement, css } from '@adbl/bullet';
import styles from './styles.css?inline';

const MyComponent = createElement({
  tag: 'my-component',
  styles: css(styles),
  render: () => 'Hello, World!',
});
```

## Attributes

There are instances where you want to pass attributes to your custom elements. Bullet supports this with the `attr:` prefix.

```tsx
import { createElement } from '@adbl/bullet';

const AppInput = createElement({
  tag: 'app-input',
  render: (props) => <input class={props.class} type="text" />,
});

const myInput = <AppInput attr:class="custom-app-input" class="inner-input" />;
document.body.appendChild(myInput);
```

When the element is rendered, the `attr:` prefix will be stripped from the attribute name, and the attribute will be set on the element, while the rest of the attributes will be passed to the inner element:

```html
<app-input class="custom-app-input">
  <input class="inner-input" />
</app-input>
```

---

## Anonymous components

You can also declare custom elements without tag names, meaning the tag names will be auto-generated:

```jsx
const Heading = createElement((props) => <h1>{props.text}</h1>);

document.body.append(<Heading text="Hello there" />);
```

---

## Event Handling

In Bullet, you can pass event handlers to inner elements using the regular JSX syntax.

```tsx
import { createElement } from '@adbl/bullet';

const Button = createElement({
  tag: 'my-button',
  render: (props) => <button onClick={props.onClick}>{props.label}</button>,
});

const handleClick = () => {
  console.log('Button clicked!');
};

// Usage
<Button onClick={handleClick} label="Click me" />;
```

In this example, the handleClick function is passed as the onClick prop to the Button component. When the button is clicked, the handleClick function will be called, and "Button clicked!" will be logged to the console.

As discussed under [Attributes](#attributes), you can also pass events to your custom elements using the `attr:` prefix.

```tsx
import { createElement } from '@adbl/bullet';

const Confetti = createElement({
  tag: 'party-confetti',
  render: () => '🎉',
});

document.body.append(
  <Confetti attr:onClick={() => alert('Hooray! Confetti explosion!')} />
);
```

In the above example, there is no inner element in `<party-confetti>` element; the click handler is set on the element itself.

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

const Products = createElement({
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

The `fallback` method is used to define a fallback template that will be rendered if the render method throws an error, or its Promise is rejected.

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
    const { navigate } = useRouter();
    const goToProfile = () => navigate('/profile/123');

    return <button onClick={goToProfile}>View Profile</button>;
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
