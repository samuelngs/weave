
import Inferno from 'inferno';
import InfernoDOM from 'inferno-dom';
import InfernoServer from 'inferno-server';

import router from 'weave-router';
import context from 'weave-context';

const id = 'app';

export async function initial(Component, ctx) {
  if (!Component) return null;
  return await (typeof Component.getInitialProps === 'function' ? Component.getInitialProps(ctx) : {});
}

export async function mount(ctx) {
  const state = await context();
  const root = await router(state);
  InfernoDOM.render(root, document.getElementById(id));
}

export async function print(ctx) {
  const root = await router(ctx);
  return `<!doctype html>
<html>
  <head>
    <link media="all" rel="stylesheet" href="/assets/styles.css" />
  </head>
  <body>
    <div id=${id}>${InfernoServer.renderToString(root)}</div>
    <script type="text/javascript" charset="utf-8" src="/assets/client.js"></script>
  </body>
</html>`;
}

export default async function render(ctx) {
  if (__NODESERVER__) {
    return print(ctx);
  }
  return mount();
}
