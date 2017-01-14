
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

export async function tracker(id) {
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
  ga('create', id, 'auto');
  ga('send', 'pageview');
}

export async function mount(App) {
  const state = await context();
  const { app, store, offline: progressive, ga } = await router(App, state);
  Inferno.render(<Provider store={ store }>{ app }</Provider>, document.body.childNodes[0]);
  if ( ['localhost', '127.0.0.1'].indexOf(location.hostname) === -1 && progressive ) {
    setImmediate(offline);
  }
  if ( ['localhost', '127.0.0.1'].indexOf(location.hostname) === -1 && ga ) {
    setImmediate(tracker);
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
