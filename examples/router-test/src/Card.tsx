import { component, css } from '../../../library';

export interface CardProps {
  title: string;
  description: string;
  images: string[];
  price: number;
  tags: string[];
}

export default component({
  render: (props: CardProps) => {
    return (
      <div class="Card">
        <picture class="ImageContainer">
          <img class="Image" src={props.images[0]} alt="" />
        </picture>

        <div class="Content">
          <h3>{props.title}</h3>
          <p>{props.description}</p>
          <p>{props.price}</p>
          <div>
            {props.tags.map((tag, index) => (
              <span key={index + tag}>{tag}</span>
            ))}
          </div>
        </div>
      </div>
    );
  },

  styles: css`
    .Card {
      height: min(200px, 50vh);
      width: min(200px, 50vw);
      border: 2px solid white;
      border-radius: 8px;
    }

    .ImageContainer {
      height: 60%;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #ccc;
    }

    .Image {
      height: 80%;
    }
  `,
});
