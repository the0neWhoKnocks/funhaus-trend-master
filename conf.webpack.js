const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const conf = {
  entry: './src/app.js',
  output: {
    filename: './public/js/app.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['babel-preset-env'],
            //plugins: [require('@babel/plugin-proposal-object-rest-spread')]
          }
        }
      },
      {
        test: /\.styl$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'stylus-loader']
        })
        // use: ExtractTextPlugin.extract(
        //   Object.assign({
        //     fallback: require.resolve('style-loader'),
        //     use: [
        //       {
        //         loader: require.resolve('css-loader'),
        //         options: {
        //           importLoaders: 1,
        //           minimize: true,
        //           //sourceMap: shouldUseSourceMap,
        //         },
        //       },
        //       {
        //         loader: require.resolve('stylus-loader'),
        //         options: {},
        //       },
        //     ],
        //   },
        //     extractTextPluginOptions
        //   )
        // )
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('./public/css/app.css'),

    // new webpack.optimize.ModuleConcatenationPlugin(),
    // new UglifyJsPlugin({
    //   beautify: false,
    //   output: {
    //     comments: false
    //   },
    //   mangle: {
    //     screw_ie8: true
    //   },
    //   compress: {
    //     screw_ie8: true,
    //     warnings: false,
    //     conditionals: true,
    //     unused: true,
    //     comparisons: true,
    //     sequences: true,
    //     dead_code: true,
    //     evaluate: true,
    //     if_return: true,
    //     join_vars: true,
    //     negate_iife: false
    //   },
    // }),
  ]
};

module.exports = conf;
