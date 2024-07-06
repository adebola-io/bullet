import '../../../library/jsx-runtime';

import { createElement } from '../../../library';

const App = createElement({
  render() {
    return <div>Hello world.</div>;
  },
});

document.body.prepend(<App />);
