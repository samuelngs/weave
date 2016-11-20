
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
  return `<!doctype html>
<html>
  <head>
    <title>${title}</title>
    ${meta.map(i => {
      if (typeof i !== 'object' || i === null) return '';
      return `<meta ${Object.keys(i).map(n => {
        return `${n}="${i[n]}"`
      }).join(' ')}>`;
    }).join('\n    ').trim()}
    <link media="all" rel="stylesheet" href="/assets/styles.css" />
  </head>
  <body>
    <div id=${id}>${InfernoServer.renderToString(app)}</div>
    <script type="text/javascript" charset="utf-8" src="/assets/client.js"></script>
  </body>
</html>`;
}

export default async function render(App, ctx) {
  if (typeof window === 'undefined') {
    return print(App, ctx);
  }
  return mount(App);
}
