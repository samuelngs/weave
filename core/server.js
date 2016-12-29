
import path from 'path';
import express from './express';
import client from './client.js';

import root from 'application';

const { app, port, update } = express(root, path.resolve($dirname));

export function start() {
  app.listen(port, () => {
    console.log('Server running on port ' + port);
  })
}

export function patch(root) {
  update(root);
}

export function router() {
  return root;
}

if ( process.env.NODE_ENV === 'production' ) {
  start();
}

