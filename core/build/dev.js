
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';

import express from '../express';

import client from './dev.client.js';
import server from './dev.server.js';

const config = {
  hot: false,
  host: '0.0.0.0',
  port: 5001,
  inline: true,
  quiet: false,
  noInfo: false,
  stats: {
    hash: false,
    version: false,
    timings: false,
    assets: true,
    chunks: false,
    modules: false,
    reasons: true,
    children: false,
    source: true,
    errors: true,
    errorDetails: true,
    warnings: true,
    publicPath: true
  }
};

module.exports = (dir, tmp) => {
  const compiler = webpack([
    server(dir, tmp),
    client(dir, tmp),
  ], function(err, res) {
    if (err) throw err;
    const { app, port } = express(require(`${tmp}/script`).default, tmp);
    app.listen(port, () => {
      console.log('Server running on port ' + port);
    });
    new WebpackDevServer(compiler, {
      ...config,
      contentBase: tmp,
    }).listen(config.port, config.host, (err) => {
      if (err) console.error(err)
    });
  });
  return compiler;
}
