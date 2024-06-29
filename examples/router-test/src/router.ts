import { createWebRouter, type RouteItem } from '../../..';
import About from './About';
import Home from './Home';
import App from './App';

const routes: RouteItem[] = [
  {
    path: '/',
    component: App,
    children: [
      {
        path: 'home',
        component: Home,
      },
      {
        path: 'about',
        component: About,
      },
    ],
  },
];

const router = createWebRouter({ routes });

export default router;
