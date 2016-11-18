
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
  name: 'script',
  target: 'node',
  cache:   false,
  context: dir,
  entry: './index.js',
  output: {
    path: tmp,
    filename: './script.js',
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
        test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/,
        loader: 'url',
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
    extensions: ['', '.js', '.jsx', '.css'],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin({ multiStep: true }),
    new webpack.NoErrorsPlugin(),
    new webpack.ProvidePlugin({
      fetch: 'isomorphic-fetch',
    }),
  ],
  node: {
    __filename: true,
    __dirname: true,
  },
  postcss: [],
});

