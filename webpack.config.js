/* eslint-env node */
const path               = require('path');
const ExtractTextPlugin  = require('extract-text-webpack-plugin');
const CssoWebpackPlugin  = require('csso-webpack-plugin').default;
const UglifyJsPlugin     = require('uglifyjs-webpack-plugin');
  
// Store environment variable to allow switches between 
// dev server and production builds.
const ENV = process.env.NODE_ENV || 'development';

var config = {

  entry: {
    'js/dist/imageset.js':  './assets/js/src/imageset.js',
    'js/dist/respimage.js': './assets/js/src/respimage.js',
    'css/imageset.css':     './assets/scss/imageset.scss',
  },

  output: {
    filename: '[name]',
    path: path.resolve(__dirname, 'assets'),
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
              options: {
                sourceMap: (ENV === 'development'),
              }
            },
            'resolve-url-loader',
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: (ENV === 'development'),
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: (ENV === 'development'),
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

if(ENV === 'development') {
  config.devtool = 'source-map';
}

if(ENV === 'production') {

  config.entry['js/dist/imageset.min.js']  = './assets/js/src/imageset.js';
  config.entry['js/dist/respimage.min.js'] = './assets/js/src/respimage.js';

  config.plugins.push(new UglifyJsPlugin({
    include: /\.min\.js$/,
  }));

  config.plugins.push(new CssoWebpackPlugin({
    pluginOutputPostfix: 'min',
  }));
}

module.exports = config;