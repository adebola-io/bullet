# bullet

A lightweight, efficient, and flexible library for Web Components.

[![downloads (@adbl/bullet)](https://img.shields.io/npm/dm/@adbl/bullet?label=downloads)](https://www.npmjs.com/package/@adbl/bullet)

Bullet is a robust and performant solution for creating reusable, encapsulated HTML elements. It offers a streamlined API for developing complex web applications with ease and efficiency.

<!-- TOC -->

- [bullet](#bullet)
  - [Key Features](#key-features)
  - [Installation](#installation)
  - [Usage](#usage)
    - [Quick Start](#quick-start)
    - [Custom Elements](#custom-elements)
    - [The `createElement` Function](#the-createelement-function)
    - [JSX Syntax](#jsx-syntax)
    - [Usage without JSX](#usage-without-jsx)
  - [Styling](#styling)
  - [Importing External Stylesheets](#importing-external-stylesheets)
  - [Attributes](#attributes)
  - [Anonymous components](#anonymous-components)
  - [Event Handling](#event-handling)
  - [Rendering Lists](#rendering-lists)
    - [Conditional Rendering](#conditional-rendering)
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

## Key Features

- **Lightweight**: Minimal overhead for optimal performance
- **Web Components**: First-class support for custom elements
- **JSX Support**: Familiar syntax for React developers
- **Reactive**: Built-in reactivity with `@adbl/cells`
- **Async Components**: Easy handling of asynchronous rendering
- **Routing**: Built-in routing system for single-page applications
- **Scoped Styling**: Encapsulated CSS using Shadow DOM
- **No Build Step Required**: Can be used directly in the browser

## Installation

To create a new Bullet project, run the following command:

```bash
npx create-bullet-app
```

- Configure project when prompted.

- Navigate to project directory:

  ```bash
  cd your-project-name
  ```

- Install dependencies:

  ```bash
  npm install
  ```

- Start development server:

  ```bash
  npm run dev
  ```

- Open `http://localhost:5173` in your browser.

You're now ready to build with Bullet! 🚀

## Usage

### Quick Start

Here's a simple example to get you started with Bullet:

```jsx
import { createElement } from '@adbl/bullet';
import { Cell } from '@adbl/cells';

// Create a simple counter component
const Counter = createElement({
  tag: 'my-counter',
  render: () => {
    const count = Cell.source(0);

    return (
      <div>
        <output>{count}</output>
        <button onClick={() => count.value++}>Increment</button>
      </div>
    );
  },
});

// Use the component
document.body.append(<Counter />);
```

This example creates a simple counter component with Bullet and adds it to the page. The following sections will dive deeper into Bullet's features and usage.

### Custom Elements

Custom elements in Bullet allow you to define new HTML tags with associated behavior. They encapsulate functionality and can be reused throughout your application.

### The `createElement` Function

The `createElement` function is the core of Bullet's component creation system. It takes an object as an argument, which defines the properties and behavior of your custom element.

The key properties of the `createElement` object are:

1. `tag`: A string that defines the name of a custom element.
2. `render`: A function that returns the content of a custom element.

Here's an example to illustrate these concepts:

```jsx
import { createElement } from '@adbl/bullet';

const Greeting = createElement({
  tag: 'app-greeting',
  render: () => {
    return <h1>Hello, World!</h1>;
  },
});
// Use it like this:
document.body.append(<Greeting />);
```

This creates a custom `<app-greeting>` element that displays "Hello, World!". The element can also be instantiated in HTML:

```html
<app-greeting></app-greeting>
```

---

### JSX Syntax

JSX is a syntax extension for JavaScript that allows you to write HTML-like code within your JavaScript files. It is most famously used with React to describe the structure and appearance of UI components.

Bullet supports a similar syntax, and compiles to regular DOM nodes.

```jsx
import { createElement } from '@adbl/bullet';

const Greeting = createElement({
  tag: 'app-greeting',
  render: (props) => {
    return (
      <div>
        <h1>Hello, {props.name}!</h1>
        <p>Welcome to Bullet</p>
      </div>
    );
  },
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

It is mostly recommended to use Bullet with JSX, as it provides a lot more features and functionality.

---

## Styling

Components can be styled using the `styles` property on the component object, and the `css` function, which can be used to generate CSS from JavaScript strings.

```tsx
import { createElement, css } from '@adbl/bullet';

const AppButton = createElement({
  tag: 'app-button',
  render: (props) => {
    return <button>{props.label}</button>;
  },

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

By default, the stylesheets are scoped using the shadow DOM. This means in the example above, the styles for `button` will affect any `<button>` element _within_ the `AppButton` component, and will be unreachable from outside it. This provides native encapsulation and isolates styles, preventing side effects on other components.

When the html is rendered:

```html
<app-button>
  <!-- # In the shadow DOM: -->
  <!-- This button will have a red background, rounded corners, and padding. -->
  <button>Click me</button>
</app-button>
<!-- But this button will not. -->
<button>Click me too</button>
```

There may be a need to instead apply styles to the whole document, and this can be achieved by using the `globalStyles` property instead:

```tsx
import { createElement, css } from '@adbl/bullet';

const AppButton = createElement({
  tag: 'app-button',
  render: (props) => {
    return <button>{props.label}</button>;
  },

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

NOTE: This still wont affect the styles of other custom elements, only styles of elements in the root DOM. The best use case for this is to apply styles to the body or html element when a custom element is present in the DOM.

## Importing External Stylesheets

Bullet also supports importing external CSS files directly into your components. This can be particularly useful for organizing your styles or when working with existing CSS files. To import an external stylesheet when using Vite, you can use the `?inline` query parameter in your import statement.

Here's an example of how to import and use an external CSS file in your Bullet component:

```css
/* my-component/styles.css */

:host {
  /* Styles for the custom element itself. */
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
  render: () => {
    return 'Hello, World!';
  },
});
```

This way you can separate your styles from your components and keep them organized.

## Attributes

There are instances where you want to pass attributes to your custom elements. Bullet supports this with the `attr:` prefix.

```tsx
import { createElement } from '@adbl/bullet';

const AppInput = createElement({
  tag: 'app-input',
  render: (props) => {
    return <input class={props.class} type="text" />;
  },
});

const myInput = <AppInput attr:class="custom-app-input" class="inner-input" />;
document.body.appendChild(myInput);
```

When the element is rendered, the `attr:` prefix will be stripped from the attribute name, and the attribute will be set on the element, while the rest of the attributes will be passed as props.

```html
<app-input class="custom-app-input">
  <input class="inner-input" />
</app-input>
```

---

## Anonymous components

You can also declare custom elements without tag names, meaning the tag names will be auto-generated:

```jsx
const Heading = createElement((props) => {
  return <h1>{props.text}</h1>)
};

document.body.append(<Heading text="Hello there" />);
```

---

## Event Handling

In Bullet, you can pass event handlers to inner elements using the regular JSX syntax.

```tsx
import { createElement } from '@adbl/bullet';

const Button = createElement({
  tag: 'my-button',
  render: (props) => {
    return <button onClick={props.onClick}>{props.label}</button>;
  },
});

const handleClick = () => {
  console.log('Button clicked!');
};

// Usage
<Button onClick={handleClick} label="Click me" />;
```

In this example, the handleClick function is passed as the onClick prop to the Button component. When the button is clicked, the handleClick function will be called, and "Button clicked!" will be logged to the console.

As discussed in the [Attributes](#attributes) section, you can also pass events to your custom elements using the `attr:` prefix.

```tsx
import { createElement } from '@adbl/bullet';

const Confetti = createElement({
  tag: 'party-confetti',
  render: () => {
    return '🎉';
  },
});

document.body.append(
  <Confetti attr:onClick={() => alert('Hooray! Confetti explosion!')} />
);
```

In the above example, there is no inner element in `<party-confetti>` element; the click handler is set on the element itself.

---

## Rendering Lists

There are a number of ways to render lists in bullet. A list can be rendered by mapping over an array of data, similar to how it would be done in a React component.

```tsx
import { createElement } from '@adbl/bullet';

const taskItems = ['Learn Bullet', 'Build a web app', 'Deploy to production'];

const TodoList = createElement({
  tag: 'todo-list',
  render: () => {
    return (
      <ul>
        {taskItems.map((todo) => {
          return <li>{todo}</li>;
        })}
      </ul>
    );
  },
});
```

You can also use the `For` function exported from the bullet library. A major advantage is that it allows you to map over other iterable objects, such as Maps and Sets.

```tsx
import { createElement, For } from '@adbl/bullet';

const TodoList = createElement({
  tag: 'todo-list',
  render: () => {
    return (
      <ul>
        {For(taskItems, (item) => {
          return <li>{item}</li>;
        })}
      </ul>
    );
  },
});
```

Bullet has first class support for the `@adbl/cells` library, which allows you to create reactive values and use them in Javascript.

You can create a reactive array cell, and whenever the array updates, the list of DOM
elements it generates will be updated automatically.

```tsx
import { createElement, For } from '@adbl/bullet';
import { Cell } from '@adbl/cells';

const listItems = Cell.source([
  'Master the art of bullet-dodging',
  'Create a time machine',
  'Invent a new flavor of ice cream',
]);

const TodoList = createElement({
  tag: 'todo-list',
  render: () => {
    return (
      <ul>
        {For(listItems, (item) => {
          return <li>{item}</li>;
        })}
      </ul>
    );
  },
});
document.body.appendChild(<TodoList />);

// Later, when the listItems cell updates, the DOM will be updated automatically.
listItems.value.push('Befriend a unicorn');
```

> The `For` function is aggressive when it comes to caching nodes for performance optimization.
> This means that the callback function provided to `For` **should** be pure and not rely on external state or produce side effects, because the callback function might not be called when you expect it to be.
>
> Here's an example to illustrate why this is important:
>
> ```tsx
> import { createElement, For } from '@adbl/bullet';
> import { Cell } from '@adbl/cells';
>
> let renderCount = 0;
> const items = Cell.source([
>   { id: 1, name: 'Alice' },
>   { id: 2, name: 'Bob' },
>   { id: 3, name: 'Charlie' },
> ]);
>
> const List = createElement({
>   tag: 'user-list',
>   render: () => {
>     return (
>       <ul>
>         {For(items, (item) => {
>           renderCount++; // This is problematic!
>           return (
>             <li>
>               {item.name} (Renders: {renderCount})
>             </li>
>           );
>         })}
>       </ul>
>     );
>   },
> });
>
> document.body.append(<List />);
> // Initial output:
> // - Alice (Renders: 1)
> // - Bob (Renders: 2)
> // - Charlie (Renders: 3)
>
> // Later:
> items.value.splice(1, 0, { id: 4, name: 'David' });
> // Actual output:
> // - Alice (Renders: 1)
> // - David (Renders: 4)
> // - Bob (Renders: 2)
> // - Charlie (Renders: 3)
> ```
>
> In this example, when we splice a new item into the middle of the array, the `For` function reuses the existing nodes for Alice, Bob, and Charlie. It only calls the callback function for the new item, David. This leads to an unexpected render count for David.
>
> To avoid this issue, use the reactive index provided by `For`:
>
> ```tsx
> const List = createElement({
>   tag: 'user-list',
>   render: () => {
>     return (
>       <ul>
>         {For(items, (item, index) => {
>           return (
>             <li>
>               {item.name} (Index: {index})
>             </li>
>           );
>         })}
>       </ul>
>     );
>   },
> });
> ```
>
> This approach ensures correct behavior regardless of how the array is modified, as the index is always up-to-date.

---

### Conditional Rendering

The `If` function provides conditional rendering based on the truthiness of a value.

```tsx
import { createElement, If } from '@adbl/bullet';

const isLoggedIn = false;
const username = 'John';

const ConditionalGreeting = createElement({
  tag: 'conditional-greeting',
  render: () => {
    return (
      <div>
        {If(isLoggedIn, () => {
          return <h1>Welcome back, {username}!</h1>;
        })}
      </div>
    );
  },
});
```

The `If` function also accepts a third argument, which is a callback function that is called when the condition is falsy.

```tsx
import { createElement, If } from '@adbl/bullet';

const isLoggedIn = false;
const username = 'John';

const ConditionalGreeting = createElement({
  tag: 'conditional-greeting',
  render: () => (
    <div>
      {If(
        isLoggedIn,
        () => {
          return <h1>Welcome back, {username}!</h1>;
        },
        () => {
          return <h1>Please log in</h1>;
        }
      )}
    </div>
  ),
});
```

It can also be used with the `@adbl/cells` library. The `If` function will automatically update the DOM when the cell value changes.

```tsx
import { createElement, If } from '@adbl/bullet';
import { Cell } from '@adbl/cells';

const isLoggedIn = Cell.source(false);
const username = Cell.source('');

const LoginStatus = createElement({
  tag: 'login-status',
  render: () => (
    <div>
      {If(
        isLoggedIn,
        () => (
          <div>
            <h1>Welcome back, {username}!</h1>
            <button onClick={() => (isLoggedIn.value = false)}>Logout</button>
          </div>
        ),
        () => (
          <div>
            <h1>Please log in</h1>
            <input
              type="text"
              placeholder="Enter username"
              onInput={(e) => (username.value = e.target.value)}
            />
            <button onClick={() => (isLoggedIn.value = true)}>Login</button>
          </div>
        )
      )}
    </div>
  ),
});
// Usage
document.body.append(<LoginStatus />);
```

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
        {data.map((item) => {
          return <li key={item.id}>{item.name}</li>;
        })}
      </ul>
    );
  },
});
```

You can then use `Products` anywhere just like a regular component:

```tsx
document.body.append(<Products />);
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
  initial: () => {
    return <div>Loading...</div>;
  },
});
```

The `fallback` method is used to define a fallback template that will be rendered if the render method throws an error, or its Promise is rejected.

```tsx
const ErrorComponent = createElement({
  tag: 'error-component',
  render: async () => {
    throw new Error('Oops, something went wrong!');
  },
  fallback: (error) => {
    return <div>Error: {error.message}</div>;
  },
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
  render: () => {
    return <h1>Welcome to the Home Page</h1>;
  },
});

const About = createElement({
  tag: 'about-page',
  render: () => {
    return <h1>About Us</h1>;
  },
});

const NotFound = createElement({
  tag: 'not-found',
  render: () => {
    return <h1>404 - Page Not Found</h1>;
  },
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

Great question.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
