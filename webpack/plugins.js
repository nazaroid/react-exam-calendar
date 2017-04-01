var path = require('path');
var util = require('util');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var webpack = require('webpack');
var pkg = require('../package.json');
var autoprefixer = require('autoprefixer');

var DEBUG = process.env.NODE_ENV === 'development';
var TEST = process.env.NODE_ENV === 'test';

var cssBundle = path.join('css', util.format('[name].%s.css', pkg.version));

var plugins = [
  new webpack.optimize.OccurrenceOrderPlugin(),
  new webpack.LoaderOptionsPlugin({
    debug: DEBUG,
    options: {
      context: path.join(__dirname, '../app'),
      output: { path: pkg.config.buildDir },
      postcss: [
        autoprefixer
      ]
    }
  })
];
if (DEBUG) {
  plugins.push(
    new webpack.HotModuleReplacementPlugin()
  );
} else if (!TEST) {
  plugins.push(
    new ExtractTextPlugin({
      filename: cssBundle,
      allChunks: true
    }),
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new webpack.NoEmitOnErrorsPlugin()
  );
}

module.exports = plugins;
