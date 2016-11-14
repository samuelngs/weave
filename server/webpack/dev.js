
var path = require('path');
var webpack = require('webpack');

var server = require('./dev.server.js');
var client = require('./dev.client.js');

var WebpackDevServer = require('webpack-dev-server');

new WebpackDevServer(webpack(server), server.devServer).listen(
  server.devServer.port,
  server.devServer.host,
  (err) => {
    if (err) {
      throw err
    } else {
      console.log('dev server running on port ' + server.devServer.port);
    }
  }
);

module.exports = [
  server,
  client,
];
