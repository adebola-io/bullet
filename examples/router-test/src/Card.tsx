import {
  component,
  css,
  useRouter,
  type BulletElement,
} from '../../../library';
import { searchBarText } from './signals';

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
    const { Link } = useRouter();

    return (
      <li class="Card">
        <Link plain to={`/products/${props.id}`}>
          <picture class="ImageContainer">
            <img class="Image" src={props.images[0]} alt="" />
          </picture>

          <div class="Content">
            <h3 class="Title">{props.title}</h3>
            <p class="Description">{props.description}</p>
            <p class="Price">{props.price}</p>
            <ul class="TagList">
              {props.tags.map((tag, index) => (
                <li class="Tag" key={index + tag}>
                  {tag}
                </li>
              ))}
            </ul>
          </div>
        </Link>
      </li>
    );
  },

  onMounted(this: BulletElement, props) {
    const destroyEffect = searchBarText.createEffect((text) => {
      const regex = new RegExp(text.trim().toLowerCase());
      this.style.display =
        regex.test(props.title.toLowerCase()) ||
        props.tags.some((tag) => regex.test(tag.toLowerCase()))
          ? 'block'
          : 'none';
    });

    return destroyEffect;
  },

  styles: css`
    .Card {
      width: 100%;
      border-radius: 8px;
      list-style: none;
      outline: 2px solid #ccc;
      box-shadow: 0 0 2px 0 #ccc;
      transition-duration: 200ms;
      overflow: hidden;
    }

    .Card:hover {
      box-shadow: 0 0 5px 0 #ccc;
      scale: 1.01;
      outline-width: 2px;
      outline-color: var(--outline-color);
    }

    .ImageContainer {
      height: 150px;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: gainsboro;
    }

    .Image {
      height: 80%;
    }

    .Content {
      padding: 10px;
    }

    .Title {
      margin-top: 5px;
      margin-bottom: 0;
      font-size: 1rem;
    }

    .Description {
      font-size: 10pt;
      display: -webkit-box;
      line-clamp: 4;
      -webkit-line-clamp: 4;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .Price {
      font-weight: bold;
      font-size: 1.3rem;
      margin: 0;
    }

    .TagList {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin: 0;
      padding: 0;
      padding-block: 20px 15px;
    }

    .Tag {
      display: inline-block;
      list-style: none;
      font-size: 8pt;
      text-transform: uppercase;
      border: 1px solid var(--outline-color);
      color: var(--outline-color);
      padding: 2px 5px;
    }

    @media (prefers-color-scheme: dark) {
      .Card {
        background-color: #222;
        color: white;
        outline-color: transparent;
      }

      .ImageContainer {
        background-color: #333;
      }
    }
  `,
});
