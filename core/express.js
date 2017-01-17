
import path from 'path';
import express from 'express';
import cookies from 'cookie-parser';
import compression from 'compression';
import proxy from 'proxy-middleware';
import url from 'url';

import render from './render';
import context from './context';

export default function server(App, dir = process.cwd()) {

  const app = express();
  const port = process.env.NODE_ENV === 'production' && process.env.PORT || 5000;

  let router = App;
  let update = replace => router = replace;

  app.use(compression());
  app.use(cookies());

  app.get('/favicon.ico', (req, res) => res.status(404).end());

  app.get('/robots.txt', async (req, res) => {
    const ctx = await context(req, res);
    const { props: { robots } } = new router(ctx);
    if ( !robots ) {
      return res.status(404).end();
    }
    if ( typeof robots === 'function' ) {
      return res.status(200).send(robots(ctx));
    }
    return res.status(200).send(robots);
  });

  app.get('/sitemap.xml', async (req, res) => {
    const ctx = await context(req, res);
    const { props: { sitemap } } = new router(ctx);
    if ( !sitemap ) {
      return res.status(404).end();
    }
    if ( typeof sitemap === 'function' ) {
      return res.set('Content-Type', 'application/xml').status(200).send(sitemap(ctx));
    }
    return res.set('Content-Type', 'application/xml').status(200).send(sitemap);
  });

  app.use('/ctx', (req, res) => res.json(req.headers));

  if (process.env.NODE_ENV !== 'production') {
    app.use('/sw.js', proxy(url.parse('http://127.0.0.1:5001')));
    app.use('/assets', proxy(url.parse('http://127.0.0.1:5001/assets')));
  } else {
    app.use('/sw.js', (req, res) => res.sendFile(path.join(dir, 'sw.js')));
    app.use('/assets', express.static(path.join(dir, 'assets')));
  }

  app.use('/*', async (req, res) => await render(router, await context(req, res)));

  return { port, app, update };
}

