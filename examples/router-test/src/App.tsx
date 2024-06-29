import { component, css, useRouter } from '../../../library';

export default component({
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
      --page-height: calc(100vh - 70px);
    }

    header {
      position: sticky;
      top: 0;
      z-index: 99;
      display: flex;
      justify-content: end;
      align-items: center;
      height: 70px;
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

    @media (prefers-color-scheme: dark) {
      header {
        background-color: #151515;
        color: white;
      }
    }
  `,
});
