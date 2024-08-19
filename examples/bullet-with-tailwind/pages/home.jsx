import { createElement } from '../setup';
import { useRouter } from '@adbl/bullet';

export default createElement({
  tag: 'home-page',
  render: () => {
    const { Link } = useRouter();
    return (
      <main>
        <section
          class={[
            'flex flex-col items-center justify-center text-center gap-5 pt-[--header-height] min-h-[calc(100vh-var(--header-height))]',
            'md:min-h-screen md:pt-0',
          ]}
        >
          <h1 class="text-4xl md:text-6xl lg:text-8xl text-balance max-w-[90vw] md:max-w-[70vw] animate-fade-up animate-300 font-almareno leading-tight">
            Web components made <span class="text-red-800 italic">easy</span>.
          </h1>
          <p class="max-w-[90vw] md:max-w-[min(60vw,800px)] text-sm md:text-xl animate-fade-up [--start-translate-y:30%] animate-800">
            Hello there! Welcome to the Bullet with Tailwind demo. This is a
            simple website built with Bullet and Tailwind. Bullet is a
            JavaScript library that allows you to create web components with
            ease. It's a great way to build modern, fast, and responsive
            websites.
          </p>

          <div class="flex-center gap-4 flex-wrap max-w-[80vw] md:max-w-[unset]">
            <button
              class="flex-center bg-red-800 text-white py-4 min-w-[200px] h-[56px]"
              type="button"
            >
              View Docs
            </button>
            <button
              type="button"
              class="flex-center outline-red-800 outline-2 outline text-red-800 py-4 min-w-[200px] h-[54px]"
            >
              Get Started
            </button>
          </div>
        </section>
      </main>
    );
  },
});
