import { createWebRouter, type RouteRecords } from '@adbl/bullet';
import Home from './Home';
import App from './App';
import { lazy } from '@adbl/bullet';
import { createElement } from './setup';

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
      {
        name: '404 not found',
        path: '*',
        component: createElement(() => 'This page does not exist.'),
      },
    ],
  },
];

const router = createWebRouter({ routes });

export default router;
