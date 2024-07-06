import { createWebRouter, type RouteRecords } from '../../../library/router';
import Home from './Home';
import App from './App';
import { lazy } from '../../../library';

const routes: RouteRecords = [
  {
    name: 'app',
    path: '/',
    component: App,
    redirect: '/home',
    children: [
      {
        name: 'home page',
        path: 'home',
        component: Home,
      },
      {
        name: 'about page',
        path: 'about',
        component: lazy(() => import('./About')),
      },
    ],
  },
];

const router = createWebRouter({ routes });

export default router;
