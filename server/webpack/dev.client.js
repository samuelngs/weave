
var path = require('path');
var webpack = require('webpack');

var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  name: 'client',
  target: 'web',
  context: path.join(__dirname, '..'),
  entry: [
    'webpack-dev-server/client?http://0.0.0.0:5001',
    'webpack/hot/only-dev-server',
    './client.js',
  ],
  devtool: 'eval',
  output: {
    path: path.resolve(__dirname, '..', '..', 'build'),
    filename: 'client.js',
    publicPath: 'assets/',
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
      { test: /\.css$/, loader: ExtractTextPlugin.extract('style', 'css-loader?module&importLoaders=1!postcss-loader') },
    ]
  },
  resolve: {
    root: [path.join(__dirname, '..')],
    extensions: ['', '.js', '.jsx', '.css'],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin({ multiStep: true }),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      __NODESERVER__: false,
      __NODECLIENT__: true,
      __PRODUCTION__: false,
    }),
    new ExtractTextPlugin('styles.css'),
  ],
  postcss: [],
};

