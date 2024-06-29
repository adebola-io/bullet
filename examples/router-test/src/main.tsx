/// <reference types="vite/client" />

import router from './router';

import '../../../library/jsx-runtime';

document.querySelector('#app')?.append(<router.Outlet />);
