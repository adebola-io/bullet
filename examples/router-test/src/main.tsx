/// <reference types="vite/client" />

import '../../../library/jsx-runtime';

import router from './router';

document.querySelector('#app')?.append(<router.Outlet />);
