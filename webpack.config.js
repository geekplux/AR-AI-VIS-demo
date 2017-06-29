const path = require('path');
const webpack = require('webpack');
const SRC = path.join(__dirname, 'src');
const EXAMPLE = path.join(__dirname, 'examples');

module.exports = {
  entry: {
    js: path.join(SRC, 'index.js')
  },
  output: {
    filename: 'bundle.js'
  },
  module: {
    rules: [{
      test: /\.html$/,
      use: 'file-loader?name=[name].[ext]'
    }, {
      test: /\.js$/,
      exclude: /node_modules/,
      use: [
        'babel-loader',
        'eslint-loader'
      ]
    }, {
      test: /\.css$/,
      use: [
        'style-loader',
        'css-loader?importLoaders=1',
        {
          loader: 'postcss-loader',
          options: {
            plugins: function () {
              return [
                require('precss'),
                require('autoprefixer')
              ];
            }
          }
        }
      ]
    }, {
      test: /\.(png|jpg|svg)$/,
      use: 'url-loader?limit=80000'
    }, {
      test: require.resolve('tracking'),
      use: 'imports-loader?this=>window'
    }]
  },
  resolve: {
    extensions: ['.js'],
    alias: {
      'tracking-face': 'tracking/build/data/face.js'
    }
  },
  devtool: 'evil-source-map',
  devServer: {
    contentBase: EXAMPLE,
    inline: true,
    stats: { color: true },
    port: 3000,
    host: '0.0.0.0',
    disableHostCheck: true,
    https: true
  },
  plugins: [
    new webpack.ProvidePlugin({
      tracking: 'tracking'
    })
  ]
};
