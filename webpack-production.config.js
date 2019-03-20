const webpack = require('webpack');
const fs = require('fs');
const path = require('path');
const autoprefixer = require('autoprefixer');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const packageConfig = require('./package');

const buildPath = path.resolve(__dirname, 'release');
const apiConfigFile = path.resolve(__dirname, 'api.json');
let apiConfig;
if (fs.existsSync(apiConfigFile)) {
  apiConfig = JSON.parse(fs.readFileSync(apiConfigFile));
} else {
  apiConfig = {
    appKey: process.env.API_KEY,
    appSecret: process.env.API_SECRET,
    server: process.env.API_SERVER,
    redirectUri: process.env.REDIRECT_URI,
  };
}
const version = packageConfig.version;

const config = {
  mode: 'production',
  entry: {
    index: ['@babel/polyfill', './src/index.js'],
    proxy: ['@babel/polyfill', './src/proxy.js'],
    redirect: ['@babel/polyfill', './src/redirect.js'],
  },
  output: {
    path: buildPath,
    filename: '[name].js',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
        API_CONFIG: JSON.stringify(apiConfig),
        APP_VERSION: JSON.stringify(version),
      },
    }),
    new CopyWebpackPlugin([
      { from: 'src/assets', to: 'assets' },
      { from: 'src/index.html', to: 'index.html' },
      { from: 'src/proxy.html', to: 'proxy.html' },
      { from: 'src/redirect.html', to: 'redirect.html' },
      { from: 'src/manifest.json', to: 'manifest.json' },
      { from: 'src/service-worker.js', to: 'service-worker.js' }
    ]),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.md$/,
        use: 'raw-loader',
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ],
      },
      {
        test: /\.svg/,
        exclude: /font|src(\/|\\)assets(\/|\\)images/,
        use: [
          'babel-loader',
          'react-svg-loader',
        ],
      },
      {
        test: /\.woff|\.woff2|.eot|\.ttf/,
        use: 'url-loader?limit=15000&publicPath=./&name=fonts/[name]_[hash].[ext]',
      },
      {
        test: /\.png|\.jpg|\.gif|\.svg/,
        exclude: /ringcentral-widgets(\/|\\)assets(\/|\\)images(\/|\\).+\.svg/,
        use: 'url-loader?limit=20000&publicPath=./&name=images/[name]_[hash].[ext]',
      },
      {
        test: /\.ogg$/,
        use: 'file-loader?publicPath=./&name=audio/[name]_[hash].[ext]',
      },
      {
        test: /\.sass|\.scss/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              localIdentName: '[folder]_[local]',
              modules: true,
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: function () {
                return [
                  autoprefixer
                ];
              }
            },
          },
          {
            loader: 'sass-loader',
            options: {
              outputStyle: 'expanded',
              includePaths: ['src', 'node_modules'],
            },
          }
        ],
      },
    ],
  }
};

module.exports = config;
