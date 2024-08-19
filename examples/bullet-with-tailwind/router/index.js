import { createWebRouter, defineRoutes, lazy } from '@adbl/bullet';

export const routes = defineRoutes([
  {
    path: '/',
    redirect: '/home',
    children: [
      {
        path: '/home',
        component: lazy(() => import('../pages/home.jsx')),
        title: 'Home',
      },
    ],
  },
]);

export const router = createWebRouter({ routes });

export default router;
