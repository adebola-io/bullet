import { createWebRouter, type RouteItem } from '../../..';
import Home from './Home';
import App from './App';
import { lazy } from '../../../library';

const routes: RouteItem[] = [
  {
    path: '/',
    component: App,
    redirect: '/home',
    children: [
      {
        path: 'home',
        component: Home,
      },
      {
        path: 'about',
        component: lazy(() => import('./About')),
      },
    ],
  },
];

const router = createWebRouter({ routes });

export default router;
