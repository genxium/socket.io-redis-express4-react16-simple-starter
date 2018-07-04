const baseAbsPath = __dirname + '/';
const webModuleAbsPath = baseAbsPath + '../node_modules';

const commonConfig = require(baseAbsPath + './webpack_common_config');
const webpack = require(webModuleAbsPath + '/webpack');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin'); // Uses a latest version other than the default one provided by `webpack.optimize.UglifyJsPlugin`, reference https://webpack.js.org/plugins/uglifyjs-webpack-plugin/.

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const toExport = {
  mode: 'production',
  devtool: 'cheap-module-source-map',
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
toExport.plugins.push(
  new BundleAnalyzerPlugin({
    logLevel: 'info',
    analyzerMode: 'static'
  })
);
toExport.plugins.push(
  new MiniCssExtractPlugin({
    // Options similar to the same options in webpackOptions.output
    // both options are optional
    filename: "[name].css",
    chunkFilename: "[id].css"
  })
);
toExport.plugins.push(
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
);

const I18nPlugin = require("i18n-webpack-plugin");
const languages = {
  en_gb: require(baseAbsPath + "../../common/en_gb.json"),
  zh_cn: require(baseAbsPath + "../../common/zh_cn.json")
};

module.exports = Object.keys(languages).map(function(language) {
  const toRet = {};
  Object.assign(toRet, toExport);
  Object.assign(toRet, {
    name: language 
  });
  toRet.plugins = [new I18nPlugin(languages[language])];
  for (let val of toExport.plugins) {
    toRet.plugins.push(val);
  }

  toRet.output = {};
  for (let k in toExport.output) {
    toRet.output[k] = toExport.output[k];
  }
  Object.assign(toRet.output, {
    filename: '[name].' + language + '.bundle.js',
    chunkFilename: '[name].' + language + '.bundle.js',
  });
	return toRet;
});
