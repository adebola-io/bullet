import '../../../library/jsx-runtime';
import {
  createElement,
  createWebRouter,
  css,
  useRouter,
} from '../../../library';

let authenticated = false;

const App = createElement({
  async render() {
    const router = useRouter();

    if (!authenticated) {
      return router.navigate('/login');
    }
    return <div>Hello, World!</div>;
  },

  globalStyles: css`
    body {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
    }
  `,
});

const Login = createElement({
  async render() {
    document.title = 'Login';
    const router = useRouter();
    return (
      <button
        on:click={() => {
          authenticated = true;
          router.navigate('/');
        }}
      >
        Login
      </button>
    );
  },
});

const router = createWebRouter({
  routes: [
    {
      name: 'Home',
      path: '/',
      component: App,
    },
    {
      name: 'Login',
      path: '/login',
      component: Login,
    },
  ],
});

document.body.appendChild(<router.Outlet />);
