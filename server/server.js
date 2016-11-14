
import path from 'path';
import express from 'express';

import render from './render';

import Application from '../app';

const app = express();
const port = 5000;

app.use('/assets', express.static(path.join(__dirname, 'build')));
app.use('/*', async (req, res) => {
  return res.
    status(200).
    send(
      await render(Application),
    );
});

app.listen(port, () => {
  console.log('Server running on port ' + port);
});
