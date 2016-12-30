
import path from 'path';
import webpack from 'webpack';

import ExtractTextPlugin from 'extract-text-webpack-plugin';
import OfflinePlugin from 'offline-plugin';

const alias = { };
[
  'babel-runtime',
  'inferno',
  'inferno-component',
  'regenerator-runtime',
].forEach( n => {
  alias[n] = require.
    resolve(`${n}/package`).
    replace(/[\\\/]package\.json$/, '')
});

export default (dir) => ({
  name: 'client',
  target: 'web',
  context: path.join(__dirname, '..'),
  entry: [
    './client.js',
  ],
  devtool: 'cheap-module-source-map',
  output: {
    path: path.resolve(dir, 'dist'),
    filename: 'assets/client.js',
    publicPath: 'assets/',
  },
  module: {
    loaders: [
      {
        test: /\.js$|\.jsx$/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'stage-0'],
          plugins: [
            require.resolve('babel-plugin-inferno'),
            require.resolve('babel-plugin-transform-async-to-generator'),
            require.resolve('babel-plugin-transform-object-rest-spread'),
            require.resolve('babel-plugin-transform-class-properties'),
            require.resolve('babel-plugin-transform-runtime'),
            [
              require.resolve('babel-plugin-module-resolver'),
              {
                alias: {
                  ...alias,
                  'weave-router': path.join(__dirname, '..', 'router.js'),
                  'weave-render': path.join(__dirname, '..', 'render.js'),
                  'weave-context': path.join(__dirname, '..', 'context.js'),
                  'weave-head': path.join(__dirname, '..', 'head.js'),
                  'application': path.join(dir, 'index.js'),
                },
              },
            ],
          ]
        },
        include: [
          path.join(__dirname, '..'),
          dir,
        ],
        exclude: [
          path.join(__dirname, '..', '..', 'node_modules'),
          path.join(dir, 'node_modules'),
        ],
      },
      { test: /\.json$/, loader: 'json-loader' },
      {
        test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/,
        loader: 'file',
        query: {
          name: 'assets/[hash].[ext]',
          publicPath: '/',
          limit: 10000,
        }
      },
      { test: /\.css$/, loader: ExtractTextPlugin.extract('style', 'css-loader?minimize&module&importLoaders=1!postcss-loader') },
    ],
    noParse: [new RegExp('node_modules/localforage/dist/localforage.js')],
  },
  resolve: {
    root: [
      dir,
    ],
    alias: {
      application: dir,
    },
    extensions: ['', '.js', '.jsx', '.css'],
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      sourceMap: false,
      compress: { drop_console: true, warnings: false },
      output: { comments: false },
    }),
    new webpack.ProvidePlugin({
      fetch: 'isomorphic-fetch',
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    new ExtractTextPlugin('assets/styles.css'),
    new OfflinePlugin({
      publicPath: '/',
      relativePaths: false,
      updateStrategy: 'all',
      version: '[hash]',
      caches: {
        main: [
          '/',
          '/ctx',
          ':rest:',
        ],
      },
      externals: [
        '/',
        '/ctx',
      ],
      ServiceWorker: {
        output: 'sw.js'
      },
      AppCache: {
        directory: 'appcache/',
      },
    }),
  ],
  postcss: [],
});

