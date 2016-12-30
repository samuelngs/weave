
import Inferno from 'inferno';
import { Provider } from 'inferno-redux';
import { renderToString } from 'inferno-server';

import router, { components } from './router';
import context from './context';
import offline from './offline';

export async function mount(App, ctx) {
  const state = await context();
  const { app, store } = await router(App, state);
  Inferno.render(<Provider store={ store }>{ app }</Provider>, document.body.childNodes[0]);
  setImmediate(offline);
}

export async function print(App, ctx) {
  const { app, store } = await router(App, ctx);
  const body = renderToString(<body>
    <main>
      <Provider store={ store }>
        { app }
      </Provider>
    </main>
    <script data-weave="true" type="text/javascript" charset="utf-8" src="/assets/client.js" />
  </body>);
  const { title, meta, link } = store.getState();
  const head = renderToString(
    <head>
      <title>{ title }</title>
      { meta.map(i => <meta { ...i } />) }
      { link.map(i => <link { ...i } />) }
      <link data-weave="true" media="all" rel="stylesheet" href="/assets/styles.css" />
    </head>
  );
  ctx.res.status(200).send(`<!doctype html><html>${head}${body}</html>`);
}

export default async function render(App, ctx) {
  if (typeof window === 'undefined') {
    return print(App, ctx);
  }
  return mount(App);
}
