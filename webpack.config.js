const path = require('path');

const webpack = require('webpack');

module.exports = {
  mode: 'development',
  entry: {
    home: ['webpack-hot-middleware/client?reload=true&timeout=1000', './src/home.js'],
  },
  devtool: 'inline-source-map',
  plugins: [new webpack.HotModuleReplacementPlugin()],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    publicPath: '/',
  },
};