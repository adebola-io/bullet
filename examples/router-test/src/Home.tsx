import { component, css } from '../../../library';
import Card, { type CardProps } from './Card';

export default component({
  tag: 'home-page',

  async render() {
    const products = (await import('./products.json')).default;

    return (
      <main>
        <ul class="CardList">
          {products.map((data: CardProps) => (
            <Card {...data} key={data.id} />
          ))}
        </ul>
      </main>
    );
  },

  initial() {
    return (
      <main>
        <span class="LoadingScreen">Loading...</span>
      </main>
    );
  },

  fallback(error) {
    return <main>Could not render Home page: {error}</main>;
  },

  styles: css`
    main {
      display: flex;
      align-items: center;
      flex-direction: column;
      min-height: var(--page-height);
      padding-block: 30px;
      gap: 20px;
    }

    main:has(.LoadingScreen) {
      padding-top: 0;
      justify-content: center;
    }

    .CardList {
      --no-of-columns: 5;
      --gap-width: 15px;
      --card-width: calc(100% / var(--no-of-columns));
      --gap-count: calc(var(--no-of-columns) - 1);
      --total-gap-count: calc(var(--gap-count) * var(--gap-width));
      --gap-reduction: calc(var(--total-gap-count) / var(--no-of-columns));
      --final-card-width: calc(var(--card-width) - var(--gap-reduction));

      display: grid;
      grid-template-columns: repeat(
        var(--no-of-columns),
        var(--final-card-width)
      );
      padding-inline: 4vw;
      gap: 20px;
      margin: 0;
    }

    @media (max-width: 1500px) {
      .CardList {
        --no-of-columns: 5;
      }
    }

    @media (max-width: 1300px) {
      .CardList {
        --no-of-columns: 4;
      }
    }

    @media (max-width: 1200px) {
      .CardList {
        --no-of-columns: 3;
      }
    }

    @media (max-width: 800px) {
      .CardList {
        --no-of-columns: 2;
      }
    }

    @media (max-width: 600px) {
      .CardList {
        --no-of-columns: 1;
      }
    }
  `,
});
