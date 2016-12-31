
import path from 'path';
import webpack from 'webpack';

import WriteFilePlugin from 'write-file-webpack-plugin';

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
  name: 'server',
  target: 'node',
  context: path.join(__dirname, '..'),
  entry: [
    'webpack/hot/signal',
    './server.js',
  ],
  devtool: 'eval',
  output: {
    path: tmp,
    filename: './server.js',
    publicPath: `http://localhost:5001/`,
    libraryTarget: 'commonjs2',
  },
  devServer: {
    outputPath: tmp,
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
          dir,
        ],
        exclude: [
          path.join(dir, 'node_modules'),
          path.join(__dirname, '..', '..', 'node_modules'),
        ],
      },
      { test: /\.json$/, loader: 'json-loader' },
      {
        test: /\.(png|jpg|jpeg|gif|woff|woff2|eot)$/,
        loader: 'url',
        query: {
          name: '[hash].[ext]',
          limit: 10000,
        }
      },
      {
        test: /\.(svg|ico)$/,
        loader: 'file',
        query: {
          name: '[hash].[ext]',
          limit: 10000,
        }
      },
      { test: /\.css$/, loader: 'css-loader/locals?module&importLoaders=1!postcss-loader' },
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
    new webpack.DefinePlugin({
      $dirname: '__dirname',
    }),
    new WriteFilePlugin({ log: false }),
  ],
  node: {
    __filename: true,
    __dirname: true,
  },
  postcss: [],
});

