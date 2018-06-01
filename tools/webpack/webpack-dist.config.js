const HappyPack = require('happypack');
const webpack = require('webpack');
const resolve = require('path').resolve;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const root = (path='') => resolve(__dirname, '../../', path);

module.exports = {

  mode: 'production',

  entry: {
    app: [
      'normalize.css',
      './tools/customize.css',
      './client/index.js'
    ],
    // ventor: ['react', 'react-dom', 'react-router-dom', 'antd', 'ramda'],
  },

  output: {
    path: root('dist'),
    filename: '[name].[hash].js',
    publicPath: '/'
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        include: [root('client')],
        use: ['happypack/loader?id=babel']
      },
      {
        test: /\.css$/,
        include: [root('client')],
        use: [
          // 无法和happypack混用
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              importLoaders: 1,
              module: true,
              camelCase: true,
              localIdentName: '[name]__[local]__[hash:base64:8]'
            }
          },
          'postcss-loader',
        ]
      },
      {
        test: /\.css$/,
        include: [
          root('tools'),
          root('node_modules/antd'),
          root('node_modules/normalize.css'),
        ],
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader'
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff2?|eot|ttf|otf)(\?.*)?$/,
        use: ['happypack/loader?id=pic']
      },
    ],
  },

  plugins: [
    new HappyPack({
      id: 'babel',
      loaders: [
        {
          loader: 'babel-loader',
          options: {
            presets: ['env', 'react', 'stage-2'],
            plugins: [
              'transform-decorators-legacy',
              ['transform-runtime', {
                helpers: false,
                polyfill: false,
                regenerator: true,
                moduleName: 'babel-runtime'
              }],
              ['import', {
                libraryName: 'antd',
                style: 'css'
              }]
            ],
          }
        }
      ],
    }),
    new HappyPack({
      id: 'pic',
      loaders: [
        {
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: '[name].[hash:7].[ext]'
          }
        }
      ]
    }),
    new HtmlWebpackPlugin({
      template: resolve(__dirname, '../template/index.html'),
      pathname: 'index.html',
    }),
    new webpack.HotModuleReplacementPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].[hash].css',
      chunkFilename: '[id].[hash].css'
    })
  ],

  resolve: {
    extensions: ['.js', '.json'],
    alias: {
      assets: root('client/assets'),
      components: root('client/components'),
      constants: root('client/constants'),
      services: root('client/services'),
      pages: root('client/pages'),
      store: root('client/store'),
      utils: root('client/utils'),
    },
  },

};
