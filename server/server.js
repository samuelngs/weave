
import path from 'path';
import express from 'express';
import cookies from 'cookie-parser';
import compression from 'compression';

import render from 'weave-render';
import context from 'weave-context';

const app = express();
const port = 5000;

app.use(compression());
app.use(cookies());

app.use('/favicon.ico', (req, res) => res.status(404).end());

app.use('/ctx', (req, res) => res.json(req.headers));

app.use('/assets', express.static(path.join(__dirname, 'build')));

app.use('/*', async (req, res) => {
  return res.
    status(200).
    send(
      await render(await context(req, res)),
    );
});

app.listen(port, () => {
  console.log('Server running on port ' + port);
});
