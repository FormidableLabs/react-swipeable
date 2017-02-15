var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: [
    './index'
  ],
  output: {
    path: path.join(__dirname, 'static'),
    publicPath: '/static/',
    filename: 'bundle.js'
  },
  resolve: {
    alias: {
      react: path.join(__dirname, 'node_modules', 'react'),
    }
  },
  module: {
    rules: [
      {
        loader: 'babel-loader',
        resource: {
          test: /\.js$/,
          exclude: /node_modules/,
        }
      }
    ]
  }
};
