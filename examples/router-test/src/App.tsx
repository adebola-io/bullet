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
              <Link to={to} key={to}>
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
    }
  `,

  styles: css`
    :host {
      --page-height: calc(100vh - 70px);
    }

    header {
      position: sticky;
      top: 0;
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
  `,
});
