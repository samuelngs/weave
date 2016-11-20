
import Inferno from 'inferno';
import InfernoDOM from 'inferno-dom';
import InfernoServer from 'inferno-server';

import router from './router';
import context from './context';

const id = 'app';

export async function mount(App, ctx) {
  const state = await context();
  const { app, meta, title } = await router(App, state);
  InfernoDOM.render(app, document.getElementById(id));
}

export async function print(App, ctx) {
  const { app, meta, title } = await router(App, ctx);
  return `<!doctype html>${InfernoServer.renderToString(
    <html>
      <head>
      <title>{ title }</title>
      { meta.map(i => <meta { ...i } />) }
      <link media="all" rel="stylesheet" href="/assets/styles.css" />
      </head>
      <body>
        <div id={id}>{ app }</div>
        <script type="text/javascript" charset="utf-8" src="/assets/client.js" />
      </body>
    </html>
  )}`;
}

export default async function render(App, ctx) {
  if (typeof window === 'undefined') {
    return print(App, ctx);
  }
  return mount(App);
}
