
var path = require('path');
var webpack = require('webpack');
var modules = require('./modules');

module.exports = {
  name: 'server',
  target: 'node',
  cache:   false,
  context: path.join(__dirname, '..'),
  entry: './server.js',
  output: {
    path: path.resolve(__dirname, '..', '..', 'build'),
    filename: 'server.js',
    publicPath: 'assets/',
    libraryTarget: 'commonjs2',
  },
  module: {
    loaders: [
      {
        test: /\.js$|\.jsx$/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'stage-0'],
          plugins: ['inferno', 'transform-async-to-generator', 'transform-object-rest-spread', 'transform-class-properties', 'transform-runtime']
        },
        include: [
          path.join(__dirname, '..'),
          path.join(__dirname, '..', '..', 'app'),
        ],
        exclude: path.join(__dirname, '..', '..', 'node_modules')
      },
      { test: /\.json$/, loader: 'json-loader' },
      {
        test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/,
        loader: 'url',
        query: {
          name: '[hash].[ext]',
          limit: 10000,
        }
      },
      { test: /\.css$/, loader: 'css-loader/locals?minimize&module&importLoaders=1!postcss-loader' },
    ],
    noParse: [new RegExp('node_modules/localforage/dist/localforage.js')],
  },
  externals: modules,
  resolve: {
    root: [path.join(__dirname, '..')],
    alias: {
      'weave': 'inferno',
      'weave-component': 'inferno-component',
      'weave-router': path.join(__dirname, '..', 'router.js'),
      'weave-render': path.join(__dirname, '..', 'render.js'),
      'weave-context': path.join(__dirname, '..', 'context.js'),
      'weave-app': path.join(__dirname, '..', '..', 'app'),
    },
    extensions: ['', '.js', '.jsx', '.css'],
  },
  plugins: [
    new webpack.DefinePlugin({
      __NODESERVER__: true,
      __NODECLIENT__: false,
      __PRODUCTION__: true,
      'process.env': {
        'NODE_ENV': JSON.stringify('production'),
      },
    }),
    new webpack.ProvidePlugin({
      Inferno: 'inferno',
    }),
  ],
  node: {
    __filename: true,
    __dirname: true,
  },
  postcss: [],
};
