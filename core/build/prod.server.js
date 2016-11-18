
import path from 'path';
import webpack from 'webpack';
import modules from './modules';

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
  name: 'server',
  target: 'node',
  cache:   false,
  context: path.join(__dirname, '..'),
  entry: {
    server: './server.js',
    application: dir,
  },
  output: {
    path: path.resolve(dir, 'dist'),
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
                  'application': dir,
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
      { test: /\.css$/, loader: 'css-loader/locals?minimize&module&importLoaders=1!postcss-loader' },
    ],
    noParse: [new RegExp('node_modules/localforage/dist/localforage.js')],
  },
  externals: {
    ...modules,
    [dir]: 'commonjs application',
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
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    new webpack.ProvidePlugin({
      fetch: 'isomorphic-fetch',
    }),
    new webpack.DefinePlugin({
      $dirname: '__dirname',
    }),
  ],
  node: {
    __filename: true,
    __dirname: true,
  },
  postcss: [],
});
