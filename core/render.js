
import Inferno from 'inferno';
import { Provider } from 'inferno-redux';
import { renderToString } from 'inferno-server';

import router, { components } from './router';
import context from './context';
import offline from './offline';

const script = `<script data-weave="true" type="text/javascript" charset="utf-8" src="/assets/client.js"></script>`;

export async function unmount() {
  Inferno.render(null, document.body.childNodes[0]);
}

export async function mount(App) {
  const state = await context();
  const { app, store } = await router(App, state);
  Inferno.render(<Provider store={ store }>{ app }</Provider>, document.body.childNodes[0]);
  if ( ['localhost', '127.0.0.1'].indexOf(location.hostname) === -1 ) {
    setImmediate(offline);
  }
}

export async function print(App, ctx) {
  const { app, store, props } = await router(App, ctx);
  const body = renderToString(<body>
    <main>
      <Provider store={ store }>
        { app }
      </Provider>
    </main>
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
  const pre = `<script data-weave="true" type="text/javascript" charset="utf-8">if(!window._$)window._$=${JSON.stringify(props)};</script>`;
  ctx.res.status(200).send(`<!doctype html><html>${head}${body}${pre}${script}</html>`);
}

export default async function render(App, ctx) {
  if (typeof window === 'undefined') {
    return print(App, ctx);
  }
  return mount(App);
}

if (module.hot) {
  module.hot.accept();
}
