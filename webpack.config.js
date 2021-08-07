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
    /*
    new webpack.ProvidePlugin({
      THREE: 'three',
    }),
    */
    process.env.NODE_ENV === 'development' &&
      new webpack.HotModuleReplacementPlugin(),
  ].filter(Boolean),
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  '@babel/preset-env',
                  {
                    targets: {
                      esmodules: true,
                    },
                    useBuiltIns: 'usage',
                    corejs: 3
                  },
                ],
              ],
            }
          },
        ],
      },
      {
        test: /\.(glsl|vs|fs|vert|frag)$/,
        exclude: /node_modules/,
        use: [
          'raw-loader',
          'glslify-loader',
        ],
      },
    ],
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    publicPath: '/',
  },
  target: ['web', 'es5'],
};