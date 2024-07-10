import '../../../library/jsx-runtime';
import {
  createElement,
  createWebRouter,
  css,
  useRouter,
} from '../../../library';
import auth from './middlewares/auth';

let authenticated = false;

const App = createElement({
  async render() {
    const router = useRouter();

    if (!authenticated) {
      return router.navigate('/login');
    }
    return (
      <div>
        <button type="button" onClick={() => router.navigate('/profile/123')}>
          Profile
        </button>
      </div>
    );
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
        type="button"
        onClick={() => {
          authenticated = true;
          router.navigate('/');
        }}
      >
        Login
      </button>
    );
  },
});

const Profile = createElement({
  render() {
    const router = useRouter();
    const id = router.params.get('id');

    return <h1>Profile ID: {id}</h1>;
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
    {
      name: 'Profile',
      path: '/profile',
      children: [
        {
          name: 'Profile',
          path: ':id',
          title: 'Profile Page',
          component: Profile,
        },
      ],
    },
  ],

  middlewares: [auth],
});

document.body.appendChild(<router.Outlet />);
