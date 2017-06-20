const path = require('path');
const SRC = path.join(__dirname, 'src');
const EXAMPLE = path.join(__dirname, 'examples');

module.exports = {
  entry: {
    html: path.join(EXAMPLE, 'index.html'),
    js: path.join(SRC, 'index.js')
  },
  output: {
    filename: 'bundle.js'
  },
  module: {
    loaders: [{
      test: /\.html$/,
      loader: 'file?name=[name].[ext]'
    }, {
      test: /\.js$/,
      exclude: /node_modules/,
      loaders: [
        'babel-loader',
        'eslint-loader'
      ]
    }, {
      test: /\.css$/,
      loaders: [
        'style-loader',
        'css-loader?importLoaders=1',
        'postcss-loader'
      ]
    }, {
      test: /\.json$/,
      loader: 'json-loader'
    }, {
      test: /\.(png|jpg|svg)$/,
      loader: 'url?limit=80000'
    }]
  },
  resolve: {
    extensions: ['', '.js']
  },
  devtool: 'evil-source-map',
  devServer: {
    contentBase: EXAMPLE,
    inline: true,
    progress: true,
    stats: { color: true },
    port: 3000,
    host: '0.0.0.0',
    disableHostCheck: true
  },
  postcss: function () {
    return [
      require('precss'),
      require('autoprefixer')
    ];
  }
};
