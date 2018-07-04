const baseAbsPath = __dirname + '/';

const constants = require(baseAbsPath + '../../common/constants');
const webModuleAbsPath = baseAbsPath + '../node_modules';

const commonConfig = {
  resolve: {
    modules: [
      webModuleAbsPath
    ], 
  },
  resolveLoader: {
    modules: [
      webModuleAbsPath // This helps to resolve loader names, e.g. 'babel-loader'
    ]
  },
  entry: {
    player: baseAbsPath + '../player/index.js'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              require.resolve(webModuleAbsPath + '/babel-preset-react'),
              require.resolve(webModuleAbsPath + '/babel-preset-es2015'),
              require.resolve(webModuleAbsPath + '/babel-preset-stage-0'),
            ],
          }
        }
      },
      {
        test: /\.css$/,
        exclude: /\.useable\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ]
      },
      {
        test: /\.useable\.css$/,
        use: [
          'style-loader/useable',
          'css-loader', 
        ]
      },
      {
        test: /\.scss$/,
        use: [
            // fallback to style-loader in development
            process.env.NODE_ENV !== 'production' ? 'style-loader' : MiniCssExtractPlugin.loader,
            "css-loader",
            "sass-loader"
        ]
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          'less-loader',
        ]
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
          'file-loader',
          'image-webpack-loader'
        ],
      },
      {
        test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          'url-loader?limit=10000&mimetype=application/font-woff'
        ]
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          'url-loader?limit=10000&mimetype=application/octet-stream'
        ]
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          'file-loader'
        ]
      },
    ]
  },
  output: {
    path: baseAbsPath + '../bin',
    publicPath: constants.ROUTE_PATHS.BASE + '/bin/', // NOTE: For chunk loading.
    filename: '[name].bundle.js',
    chunkFilename: '[name].bundle.js',
    sourceMapFilename: '[file].map'
  }
};

exports.default  = commonConfig;
