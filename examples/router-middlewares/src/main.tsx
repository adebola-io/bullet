import '../../../library/jsx-runtime';

import { component } from '../../../library';

const App = component({
  render() {
    return <div>Hello world.</div>;
  },
});

document.body.prepend(<App />);
