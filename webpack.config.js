const webpack = require('webpack');
const path = require('path');

module.exports = {
  context: __dirname + "/src/js",
  devtool: 'source-map',
  entry: {
    'home': 'home.js'
  },
  resolve: {
    root: [
      path.resolve('./src/js'),
    ],
  },
  output: {
    filename: "[name].min.js"
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      utils: 'utils'
    }),
    new webpack.optimize.UglifyJsPlugin()   
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'babili']
        }
      }
    ],
    rules: [
      {
        test: /\.json$/,
        use: 'json-loader'
      }
    ]
  }
};