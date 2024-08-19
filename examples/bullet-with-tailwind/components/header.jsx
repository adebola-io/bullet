import { createElement } from '../setup';
import { sidebarIsOpen, toggleSidebar } from '../cells';

import { css, helpers, useRouter } from '@adbl/bullet';

export const Header = createElement({
  tag: 'header',
  render: () => {
    const { Link } = useRouter();

    return (
      <header
        class={[
          'fixed top-0 flex items-center justify-center w-full h-[--header-height] z-10',
          'md:px-7',
        ]}
      >
        <div class="flex items-center justify-between text-white rounded-[45px] px-[40px] py-[15px] min-w-[--header-width]">
          <h1
            class="text-red-800 duration-500 font-bold text-2xl italic font-almareno"
            data-open={sidebarIsOpen}
          >
            <Link to="/home" plain>
              adebola.io
            </Link>
          </h1>
          <button
            class="bg-red-800 border-white hover:border-red-300 [&:hover_svg]:text-red-300 border-2 border-solid shadow-sm p-4 rounded-[50%] duration-300 hover:scale-110"
            type="button"
            onClick={toggleSidebar}
          >
            <helpers.InlineSvg
              href="/icons/hamburger-icon.svg"
              class="size-[30px] text-white duration-300"
            />
          </button>
        </div>
      </header>
    );
  },
  styles: css`
    h1[data-open='true'] {
      color: white;
    }
  `,
});
