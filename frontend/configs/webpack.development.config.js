const baseAbsPath = __dirname + '/';
const webModuleAbsPath = baseAbsPath + '../node_modules';

const commonConfig = require(baseAbsPath + './webpack_common_config');
const webpack = require(webModuleAbsPath + '/webpack');

const toExport = {
  mode: 'development',
  devtool: 'eval',
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
