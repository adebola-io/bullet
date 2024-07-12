import { CUSTOM_ELEMENT_NODE_LIST } from './constants.js';

/**
 * @param {{[key: string] : any}} module
 */
export function update(module) {
  const elementConstructors = Object.values(module).filter(
    (exportedValue) =>
      typeof exportedValue === 'function' &&
      exportedValue.__isBulletConstructor__
  );
  let elementsUpdated = 0;

  for (const elementConstructor of elementConstructors) {
    const tagName = elementConstructor.tagName;
    const matchingElements = CUSTOM_ELEMENT_NODE_LIST.get(tagName)?.keys();

    if (!matchingElements) continue;

    for (const matchingElement of Array.from(matchingElements)) {
      if (!('bullet__finalProps' in matchingElement)) continue;
      const newNode = elementConstructor(matchingElement.bullet__finalProps);

      let replaced = false;
      // if the element is in a light DOM.
      const parentNode = matchingElement.parentElement;
      if (parentNode) {
        parentNode?.replaceChild(newNode, matchingElement);
        replaced = true;
      } else {
        // if the element is in a shadow DOM.
        const shadowRoot = matchingElement.getRootNode();
        if (shadowRoot) {
          shadowRoot.replaceChild(newNode, matchingElement);
        }
        replaced = true;
      }

      if (replaced) {
        while (matchingElement.firstChild) {
          newNode.appendChild(matchingElement.firstChild);
        }
      }

      elementsUpdated += 1;
    }
  }
}
