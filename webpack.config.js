//jshint node: true
const path               = require('path');
const ExtractTextPlugin  = require('extract-text-webpack-plugin');

// store environment variable to allow switches between 
// dev server and production builds.
const ENV = process.env.NODE_ENV || 'development';

module.exports = {

  entry: {
    'js/dist/imageset.js':  './assets/js/src/imageset.js',
    'js/dist/respimage.js': './assets/js/src/respimage.js',
    'css/imageset.css':     './assets/scss/imageset.scss',
  },

  output: {
    filename: '[name]',
    // chunkFilename: 'js/[name].bundle.js',
    path: path.resolve(__dirname, 'assets'),
    publicPath: '/assets/plugins/imageset/',
  },

  module: {

    rules: [

      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },

      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: ExtractTextPlugin.extract({
          allChunks: true,
          //fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: { /*importLoaders: true,*/ sourceMap: true }
            },
            'resolve-url-loader',
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true,
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true,
                precision: 10,
                data: `$ENV: ${ENV};`,
              }
            },
          ],
        }),
      },

    ],
  },

  stats: {
    colors: true
  },
  
  devtool: 'source-map',
  // devtool: 'inline-source-map', => would needed for live workspace in chrome dev tools

  plugins: [
    new ExtractTextPlugin({
      filename: (getPath) => {
        'use strict';
        return getPath('[name]');
      },
      allChunks: true
    }),
  ],


};