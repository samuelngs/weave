
import express from 'express';
import cookies from 'cookie-parser';
import compression from 'compression';
import proxy from 'proxy-middleware';
import url from 'url';

import render from './render';
import context from './context';

export default function server(App, dir = process.cwd()) {

  const app = express();
  const port = 5000;

  app.use(compression());
  app.use(cookies());

  app.use('/favicon.ico', (req, res) => res.status(404).end());
  app.use('/ctx', (req, res) => res.json(req.headers));

  if (process.env.NODE_ENV !== 'production') {
    app.use('/assets', proxy(url.parse('http://127.0.0.1:5001/assets')));
  } else {
    app.use('/assets', express.static(dir));
  }

  app.use('/*', async (req, res) => {
    return res.
      status(200).
      send(
        await render(App, await context(req, res)),
      );
  });

  return { port, app };
}
