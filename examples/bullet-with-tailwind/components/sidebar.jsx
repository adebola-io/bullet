import { createElement } from '../setup';
import { sidebarIsOpen, toggleSidebar } from '../cells';
import { css, useRouter } from '@adbl/bullet';

const links = [
  {
    to: '/home',
    text: 'home',
  },
  {
    to: '/about',
    text: 'about',
  },
  {
    to: '/contact',
    text: 'contact',
  },
];

export const Sidebar = createElement({
  tag: 'sidebar',
  render: () => {
    const { Link } = useRouter();
    return (
      <aside
        class={[
          'fixed top-0 right-0 h-screen w-screen bg-red-800 duration-300 py-[--header-height] flex items-center justify-center',
          'md:px-[70px] md:justify-end md:text-right',
        ]}
        data-open={sidebarIsOpen}
      >
        <ul class={['flex flex-col gap-y-7 items-center', 'md:items-end']}>
          {links.map((li, index) => {
            return (
              <li
                key={li.text}
                class="overflow-hidden font-almareno italic w-fit [&:hover_hr]:translate-x-0 [&:hover_hr]:bg-red-300 ease-out"
                style={{ transitionDuration: `${(index + 1) * 200}ms` }}
              >
                <Link
                  to={li.to}
                  attr:plain
                  attr:class={[
                    'routerLink',
                    'text-white font-bold text-5xl duration-500 hover:text-red-300',
                    'md:text-7xl',
                    'lg:text-9xl',
                  ]}
                  attr:onClick={toggleSidebar}
                >
                  {li.text}
                </Link>
                <hr class="h-2 bg-white border-t-0 translate-x-[100%] duration-300" />
              </li>
            );
          })}
        </ul>
      </aside>
    );
  },
  styles: css`
    aside:not([data-open='true']) {
      opacity: 0;
      pointer-events: none;

      li {
        transform: translateX(100%);
      }
    }

    li:has(.routerLink[active]) hr {
      transform: translateX(0);
      background-color: #fca5a5;
    }

    .routerLink[active] {
      color: #fca5a5;
    }
  `,
});
