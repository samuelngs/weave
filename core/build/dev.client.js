
import path from 'path';
import webpack from 'webpack';

import cssimport from 'postcss-import';
import cssnext from 'postcss-cssnext';
import cssreport from 'postcss-reporter';
import precss from 'precss';

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

export default (dir, tmp) => ({
  name: 'client',
  target: 'web',
  context: path.join(__dirname, '..'),
  entry: [
    'webpack-dev-server/client?http://localhost:5001',
    'webpack/hot/only-dev-server',
    './client.js',
  ],
  devtool: 'eval',
  output: {
    path: tmp,
    filename: 'assets/client.js',
    publicPath: `http://localhost:5001/`,
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
                  'react': require.resolve('inferno-compat'),
                  'react-dom': require.resolve('inferno-compat'),
                  'weave-router': path.join(__dirname, '..', 'router.js'),
                  'weave-head': path.join(__dirname, '..', 'head.js'),
                  'weave-render': path.join(__dirname, '..', 'render.js'),
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
      {
        test: /\.js$|\.jsx$/,
        loader: path.join(__dirname, '..', 'hot.js'),
        query: {
          dir,
          tmp,
        },
        include: [
          dir,
        ],
        exclude: [
          path.join(__dirname, '..', '..', 'node_modules'),
          path.join(dir, 'node_modules'),
        ],
      },
      { test: /\.json$/, loader: 'json-loader' },
      {
        test: /\.(png|jpg|jpeg|gif|webp)$/,
        loader: 'url',
        query: {
          name: '[hash].[ext]',
          limit: 10000,
        }
      },
      {
        test: /\.(ttf|otf|eot|woff|woff2|svg|ico|webm|mp4|ogg)$/,
        loader: 'file',
        query: {
          name: '[hash].[ext]',
          limit: 10000,
        }
      },
      { test: /\.css$/, loader: ExtractTextPlugin.extract('style', 'css-loader?module&importLoaders=1!postcss-loader') },
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
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.ProvidePlugin({
      fetch: 'isomorphic-fetch',
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
  postcss: [
    cssimport({ addDependencyTo: webpack }),
    cssnext,
    precss,
    cssreport,
  ],
});

