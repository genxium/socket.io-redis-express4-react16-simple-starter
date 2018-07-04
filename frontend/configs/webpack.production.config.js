const baseAbsPath = __dirname + '/';
const webModuleAbsPath = baseAbsPath + '../node_modules';

const commonConfig = require(baseAbsPath + './webpack_common_config').default;
const webpack = require(webModuleAbsPath + '/webpack');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin'); // Uses a latest version other than the default one provided by `webpack.optimize.UglifyJsPlugin`, reference https://webpack.js.org/plugins/uglifyjs-webpack-plugin/.

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const toExport = {
  mode: 'production',
  devtool: 'cheap-module-source-map',
  plugins: [
    // Ignore all locale files of moment.js
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new BundleAnalyzerPlugin({
      logLevel: 'info',
      analyzerMode: 'static'
    }),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: "[name].css",
      chunkFilename: "[id].css"
    }),
    new UglifyJsPlugin({
      parallel: true,
      sourceMap: true,
      uglifyOptions: {
        compress: true,
        mangle: true,
        output: {
          comments: false,
        }
      }
    })
  ],
  optimization: {
    // Refernece https://webpack.js.org/plugins/split-chunks-plugin/.
    splitChunks: {
      chunks: 'async',
      minSize: 30000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      name: true,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  }
};

Object.assign(toExport, commonConfig);

module.exports = toExport;
