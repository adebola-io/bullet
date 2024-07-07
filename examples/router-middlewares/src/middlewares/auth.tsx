import { defineRouterMiddleware, redirect } from '../../../../library';

export default defineRouterMiddleware(({ to }) => {
  if (to.fullPath === '/') {
    return redirect('/no');
  }
});
