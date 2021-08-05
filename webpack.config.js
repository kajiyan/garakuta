const path = require('path');

const webpack = require('webpack');

module.exports = {
  mode: process.env.NODE_ENV,
  entry: {
    home: [
      process.env.NODE_ENV === 'development' &&
        'webpack-hot-middleware/client?reload=true&timeout=1000',
      './src/home.js',
    ].filter(Boolean),
  },
  devtool: 'inline-source-map',
  plugins: [
    process.env.NODE_ENV === 'development' &&
      new webpack.HotModuleReplacementPlugin(),
  ].filter(Boolean),
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    publicPath: '/',
  },
};