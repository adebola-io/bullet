import { createElement } from '@/setup';
import { If, css } from '@adbl/bullet';
import { Cell } from '@adbl/cells';
import { deriveElementBounding } from '@adbl/dom-cells/deriveElementBounding';

export interface PopupProps {
  anchor?: HTMLElement | null;
  x?: JSX.ValueOrCell<number>;
  y?: JSX.ValueOrCell<number>;
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
    const listenerOptions = { signal: host.controller.signal };

    if (Cell.isCell(x)) {
      x.listen((value) => {
        host.style.left = `${value}px`;
      }, listenerOptions);
    } else if (x) {
      host.style.left = `${x}px`;
    }

    if (Cell.isCell(y)) {
      y.listen((value) => {
        host.style.top = `${value}px`;
      }, listenerOptions);
    } else if (y) {
      host.style.top = `${y}px`;
    }

    if (anchor) {
      const anchorBounds = deriveElementBounding(anchor);

      const updateXCoordinates = () => {
        let x = anchorBounds.x.value + anchorBounds.width.value;
        const popupWidth = host.offsetWidth;
        const offsetFromScreenEdge = popupWidth + x - innerWidth;
        if (offsetFromScreenEdge > 0) {
          x -= offsetFromScreenEdge;
        }

        host.style.left = `${x}px`;
      };

      const updateYCoordinates = () => {
        let y = anchorBounds.y.value + anchorBounds.height.value;
        const popupHeight = host.offsetHeight;
        const offsetFromScreenEdge = popupHeight + y - innerHeight;
        if (offsetFromScreenEdge > 0) {
          y -= offsetFromScreenEdge;
        }

        host.style.top = `${y}px`;
      };

      updateXCoordinates();
      updateYCoordinates();

      anchorBounds.x.listen(updateXCoordinates, listenerOptions);
      anchorBounds.y.listen(updateYCoordinates, listenerOptions);
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
});

export const PopupSubMenu = createElement({
  tag: 'pop-up-submenu',

  render: () => {
    return <slot />;
  },

  connected: (_, host) => {
    const listenerOptions = { signal: host.controller.signal };
    const parentElement = host.parentElement;

    if (!parentElement) return;

    const rect = deriveElementBounding(parentElement);
    const updatePosition = () => {
      const x = rect.x.value + rect.width.value;
      const y = rect.y.value;
      host.style.left = `${x - 5}px`;
      host.style.top = `${y + 5}px`;
    };

    updatePosition();

    rect.x.listen(updatePosition, listenerOptions);
    rect.y.listen(updatePosition, listenerOptions);
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

export interface PopupListItemProps {
  hasSubmenu?: boolean;
}

export const PopupListItem = createElement<PopupListItemProps>({
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
