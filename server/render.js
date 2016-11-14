
import Inferno from 'inferno';
import InfernoDOM from 'inferno-dom';
import InfernoServer from 'inferno-server';

import context from './context';

const id = 'app';

export async function initial(Component, ctx) {
  if (!Component) return null;
  return await (typeof Component.getInitialProps === 'function' ? Component.getInitialProps(ctx) : {});
}

export async function mount(Component, ctx) {
  const props = await initial(Component, await context());
  InfernoDOM.render(<Component { ...props } />, document.getElementById(id));
}

export async function print(Component, ctx) {
  const props = await initial(Component, ctx);
  return `<!doctype html>
<html>
  <head>
    <link media="all" rel="stylesheet" href="/assets/styles.css" />
  </head>
  <body>
    <div id=${id}>${InfernoServer.renderToString(<Component { ...props } />)}</div>
    <script type="text/javascript" charset="utf-8" src="/assets/client.js"></script>
  </body>
</html>`;
}

export default async function render(Component, ctx) {
  if (__NODESERVER__) {
    return print(Component, ctx);
  }
  return mount(Component);
}
