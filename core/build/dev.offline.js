
import path from 'path';
import webpack from 'webpack';

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
  name: 'service-worker',
  target: 'web',
  context: path.join(__dirname, '..'),
  entry: [
    './sw.js',
  ],
  devtool: 'eval',
  output: {
    path: tmp,
    filename: './sw.js',
    publicPath: '/',
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
        loader: 'url',
        query: {
          name: '[hash].[ext]',
          limit: 10000,
        }
      },
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
    new webpack.HotModuleReplacementPlugin({ multiStep: true }),
    new webpack.NoErrorsPlugin(),
  ],
  postcss: [],
});
