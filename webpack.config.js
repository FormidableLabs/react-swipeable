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
  plugins: [
    new webpack.DefinePlugin({
      // retrive react-swipable version to display on demo page
      SWIPEABLE_VERSION: JSON.stringify(require("../package.json").version)
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ["@babel/preset-env", "@babel/react"],
            plugins: [
              "@babel/plugin-proposal-class-properties",
              "@babel/plugin-proposal-object-rest-spread"
            ]
          }
        }
      }
    ]
  }
};
