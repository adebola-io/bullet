import { component, css } from '../../../library';

export interface CardProps {
  id: number;
  title: string;
  description: string;
  images: string[];
  price: number;
  tags: string[];
}

export default component({
  render(props: CardProps) {
    const emitEvent = () => {
      this.dispatchEvent(new CustomEvent('card-click', { detail: props }));
    };

    return (
      <li class="Card">
        <picture onclick={emitEvent} class="ImageContainer">
          <img class="Image" src={props.images[0]} alt="" />
        </picture>

        <div class="Content">
          <h3>{props.title}</h3>
          <p>{props.description}</p>
          <p class="Price">{props.price}</p>
          <ul class="TagList">
            {props.tags.map((tag, index) => (
              <li class="Tag" key={index + tag}>
                {tag}
              </li>
            ))}
          </ul>
        </div>
      </li>
    );
  },

  styles: css`
    .Card {
      width: 100%;
      border: 2px solid white;
      border-radius: 8px;
      list-style: none;
      border: 2px solid #ccc;
      border-radius: 8px;
      box-shadow: 0 0 2px 0 #ccc;
      transition-duration: 300ms;
    }

    .Card:hover {
      box-shadow: 0 0 5px 0 #ccc;
    }

    .ImageContainer {
      height: 150px;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #ccc;
    }

    .Image {
      height: 80%;
    }

    .Content {
      padding: 10px;
    }

    .Price {
      font-weight: bold;
      font-size: 1.5rem;
    }

    .TagList {
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
      margin: 0;
      padding: 0;
    }

    .Tag {
      display: inline-block;
      list-style: none;
    }
  `,
});
