
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';

import chokidar from 'chokidar';

import client from './dev.client.js';
import server from './dev.server.js';

const config = {
  hot: true,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Expose-Headers': 'SourceMap,X-SourceMap',
  },
  watchOptions: {
    aggregateTimeout: 300,
    poll: false,
  },
  historyApiFallback: true,
  inline: true,
  quiet: false,
  noInfo: false,
  stats: {
    assets: false,
    colors: true,
    version: false,
    hash: false,
    timings: false,
    chunks: false,
    warnings: false,
    chunkModules: false,
  },
};

export default (dir, tmp) => {
  return new WebpackDevServer(webpack([
    server(dir, tmp),
    client(dir, tmp),
  ]), {
    ...config,
    outputPath: tmp,
  }).listen(5001, '0.0.0.0', err => {
    if (err) console.error(err);
    const watcher = chokidar.watch(`${tmp}/server.js`);
    watcher.on('ready', () => {
      let server;
      watcher.on('add', () => {
        server = require(`${tmp}/server.js`);
        server.start();
      });
      watcher.on('change', () => {
        delete require.cache[require.resolve(`${tmp}/server.js`)];
        const { router } = require(`${tmp}/server.js`);
        server.patch(router());
      });
    });
  });
}
