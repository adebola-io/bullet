import { component, css } from '../../../library';
import Card, { type CardProps } from './Card';

export default component({
  tag: 'home-page',
  async render() {
    try {
      const res = await fetch('https://dummyjson.com/products');
      const data = await res.json();
      const { products } = data;
      return (
        <main>
          {products.map((data: CardProps) => (
            <Card {...data} key={data.title} />
          ))}
        </main>
      );
    } catch (err) {
      console.error(err);
      return <></>;
    }
  },

  styles: css`
    main {
      display: flex;
      align-items: center;
      flex-direction: column;
      padding-top: 30px;
      gap: 20px;
      background-color: #151515;
      color: white;
    }
  `,
});
