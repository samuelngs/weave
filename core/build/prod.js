
import webpack from 'webpack';

import server from './prod.server.js';
import client from './prod.client.js';

module.exports = (dir) => {
  const compiler = webpack([
    server(dir),
    client(dir),
  ], function(err, res) {
    if (err) throw err;
  });
  return compiler;
}
