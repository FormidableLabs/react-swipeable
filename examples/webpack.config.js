var path = require('path')
var webpack = require('webpack')

const useLocalSwipeable = process.env.DEV_LOCAL === 'true';

if (useLocalSwipeable) {
  console.info('*****')
  console.info('NOTE: Using local copy of react-swipeable: src/index.ts')
  console.info('*****')
}

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: ['./index'],
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
    ...(useLocalSwipeable && {
      alias: {
        'react-swipeable': path.resolve(__dirname, '../src/index.ts'),
        // Have to alias react to avoid two versions
        'react': path.resolve(__dirname, '../examples/node_modules/react/index.js')
      }
    })
  },
  output: {
    path: path.join(__dirname, 'static'),
    publicPath: '/static/',
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.DefinePlugin({
      // retrieve react-swipeable version to display on demo page
      SWIPEABLE_VERSION: JSON.stringify(
        require('./node_modules/react-swipeable/package.json').version
      )
    })
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ]
  }
}
