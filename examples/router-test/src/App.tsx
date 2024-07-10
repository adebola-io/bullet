import { css, useRouter } from '../../../library';
import { createElement } from './setup';
import { searchBarText } from './signals';

function updateSearchBarText(e: Event) {
  const target = e.target as HTMLInputElement;
  searchBarText.value = target.value;
}

export default createElement({
  render() {
    const { Link, Outlet } = useRouter();

    const links = [
      {
        to: '/home',
        text: 'Home',
      },
      {
        to: '/about',
        text: 'About',
      },
    ];

    return (
      <>
        <header>
          <input type="search" onInput={updateSearchBarText} />
          <nav>
            {links.map(({ to, text }) => (
              <Link plain class="NavLink" to={to} key={to}>
                {text}
              </Link>
            ))}
          </nav>
        </header>
        <Outlet />
      </>
    );
  },

  globalStyles: css`
    body {
      margin: 0;
      font-family: 'Inter', sans-serif;
      --outline-color: lightskyblue;
    }

    @media (prefers-color-scheme: dark) {
      body {
        background-color: black;
        color: white;
      }

      ::-webkit-scrollbar {
        width: 10px;
      }

      /* Track */
      ::-webkit-scrollbar-track {
        background: #151515;
        padding-right: 10px;
      }

      /* Handle */
      ::-webkit-scrollbar-thumb {
        background: #555;
        border-radius: 10px;
        border: 2px solid #727272;
      }

      /* Handle on hover */
      ::-webkit-scrollbar-thumb:hover {
        background: #444;
      }
    }
  `,

  styles: css`
    :host {
      --header-height: 80px;
      --page-height: calc(100vh - var(--header-height));
    }

    header {
      position: sticky;
      top: 0;
      z-index: 99;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: var(--header-height);
      width: calc(100% - 40px);
      padding-inline: 20px;
      background-color: lightgreen;
    }

    nav {
      display: flex;
      gap: 20px;
    }

    .NavLink:hover {
      text-decoration: underline;
    }

    [active].NavLink {
      font-weight: bold;
      color: var(--outline-color);
    }

    input {
      border: none;
      border-radius: 5px;
      padding: 5px;
      font-family: inherit;
      outline: 2px solid var(--outline-color);
      width: min(300px, 50vw);
    }

    @media (prefers-color-scheme: dark) {
      header {
        background-color: #151515;
        color: white;
      }

      input {
        background-color: #151515;
        color: white;
        outline: 2px solid #727272;
      }
    }
  `,
});
