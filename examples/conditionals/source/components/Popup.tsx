import { createElement } from '@/setup';
import { If } from '@adbl/bullet';
import { type Component, css } from '@adbl/bullet';
import { Cell } from '@adbl/cells';

export interface PopupProps {
  anchor?: HTMLElement | null;
  preferredAnchorPosition?:
    | 'top-left'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-right';
  x?: JSX.ValueOrCell<number>;
  y?: JSX.ValueOrCell<number>;
}

export interface ListItemProps {
  hasSubmenu?: boolean;
}

interface PopupComponent extends Component<PopupProps> {
  SubMenu: Component<object>;
  ListItem: Component<ListItemProps>;
}

export const Popup = createElement<PopupProps>({
  tag: 'pop-up',

  render: (_, __, element) => {
    if (!element.hasAttribute('popover')) {
      element.setAttribute('popover', 'manual');
    }
    return <slot />;
  },

  connected: (props, host) => {
    const { anchor, x, y } = props;

    if (Cell.isCell(x)) {
      x.listen(
        (value) => {
          host.style.left = `${value}px`;
        },
        { signal: host.controller.signal }
      );
    } else if (x) {
      host.style.left = `${x}px`;
    }

    if (Cell.isCell(y)) {
      y.listen(
        (value) => {
          host.style.top = `${value}px`;
        },
        { signal: host.controller.signal }
      );
    } else if (y) {
      host.style.top = `${y}px`;
    }

    if (anchor) {
      const rect = anchor.getBoundingClientRect();
      switch (props.preferredAnchorPosition) {
        case 'top-left':
          host.style.left = `${rect.left}px`;
          host.style.top = `${rect.top - host.offsetHeight}px`;
          break;
        case 'top-right':
          host.style.left = `${rect.right}px`;
          host.style.top = `${rect.top - host.offsetHeight}px`;
          break;
        case 'bottom-left':
          host.style.left = `${rect.left}px`;
          host.style.top = `${rect.bottom}px`;
          break;
        case 'bottom-right':
          host.style.left = `${rect.right}px`;
          host.style.top = `${rect.bottom}px`;
          break;
        default:
          host.style.left = `${rect.left}px`;
          host.style.top = `${rect.top}px`;
      }
    }

    host.showPopover();
  },
  styles: css`
    :host {
      --popup-bg-color: white;
      --popup-border-color: #ccc;
      --popup-border-radius: 4px;
      --popup-box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      --popup-min-width: 150px;

      background-color: var(--popup-bg-color);
      border: 1px solid var(--popup-border-color);
      border-radius: var(--popup-border-radius);
      box-shadow: var(--popup-box-shadow);
      min-width: var(--popup-min-width);
      margin: 0;
      padding: 0;
    }
  `,
}) as PopupComponent;

Popup.SubMenu = createElement({
  tag: 'pop-up-submenu',

  render: () => {
    return <slot />;
  },

  connected: (_, host) => {
    const parentElement = host.parentElement;
    if (!parentElement) return;

    const rect = parentElement.getBoundingClientRect();
    host.style.left = `${rect.right}px`;
    host.style.top = `${rect.top}px`;
  },

  styles: css`
    :host {
      --submenu-bg-color: var(--popup-bg-color);
      --submenu-border-color: var(--popup-border-color);
      --submenu-border-radius: var(--popup-border-radius);
      --submenu-box-shadow: var(--popup-box-shadow);
      --submenu-min-width: var(--popup-min-width);

      position: fixed;
      background-color: var(--submenu-bg-color);
      border: 1px solid var(--submenu-border-color);
      border-radius: var(--submenu-border-radius);
      box-shadow: var(--submenu-box-shadow);
      min-width: var(--submenu-min-width);
      margin: 0;
      padding: 0;
    }
  `,
});

Popup.ListItem = createElement({
  tag: 'pop-up-list-item',

  render: (props) => {
    const { hasSubmenu } = props;
    return (
      <button class="options-item" type="button">
        <slot />
        {If(hasSubmenu, () => {
          return (
            <div class="icon-container">
              <svg
                class="icon"
                fill="#000000"
                viewBox="0 0 32 32"
                xmlns="http://www.w3.org/2000/svg"
              >
                <title>Open submenu</title>
                <path
                  xmlns="http://www.w3.org/2000/svg"
                  d="M11.303 8l11.394 7.997L11.303 24z"
                />
              </svg>
            </div>
          );
        })}
      </button>
    );
  },

  styles: css`
    :host {
      display: block;
      width: 100%;
    }

    .options-item {
      background-color: transparent;
      border: none;
      text-align: left;
      padding-block: 10px;
      width: 100%;
      display: grid;
      grid-template-columns: 1fr 20px;
      align-items: center;
      justify-content: start;
      color: inherit;

      &:hover {
        background-color: #e3e3e3;
      }
    }

    .icon-container {
      display: flex;
      justify-content: center;
      align-items: center;
      width: auto;
      aspect-ratio: 1;
      height: 100%;
    }

    .icon {
      width: 80%;
      height: 80%;
    }
  `,
});
