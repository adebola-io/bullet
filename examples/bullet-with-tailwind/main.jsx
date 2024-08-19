import { createElement } from './setup';
import { css } from '@adbl/bullet';
import router from './router';

import { Header } from './components/header';
import { Sidebar } from './components/sidebar';

const App = createElement({
  tag: 'root',
  render: () => {
    return (
      <>
        <Header />
        <Sidebar />
        <router.Outlet />
      </>
    );
  },
  globalStyles: css`
    :root {
      --header-height: 160px;
      --header-width: 100%;
    }
  `,
});

document.getElementById('app')?.appendChild(<App />);
