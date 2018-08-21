const { resolve } = require('path');
const yargs = require('yargs');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const WebpackAssetsManifest = require('webpack-assets-manifest');
const TidyPlugin = require('@noxx/webpack-tidy-plugin');

// =============================================================================

yargs
  .option('d', {
    alias: 'dev',
    desc: 'Runs in Dev mode',
    type: 'boolean',
  })
  .argv;

const flags = yargs.parse();

// =============================================================================

const hashLength = 8;
const conf = {
  context: resolve(__dirname, '../'),
  entry: {
    'app': [
      './src/app',
    ],
    'vendor': [
      'hyperapp',
      'regenerator-runtime/runtime',
      'svg.js',
    ],
  },
  output: {
    filename: `./public/js/[name].[chunkhash:${ hashLength }].js`,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            plugins: [
              ['transform-react-jsx', {
                'pragma': 'h',
              }],
              'transform-object-rest-spread',
            ],
            presets: [
              ['babel-preset-env', {
                targets: {
                  browsers: ['chrome >= 39'],
                },
              }],
            ],
          },
        },
      },
      {
        test: /\.styl$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'stylus-loader'],
        }),
      },
    ],
  },
  plugins: [
    new TidyPlugin({
      cleanOutput: true,
      hashLength,
    }),
    new ExtractTextPlugin(`./public/css/[name].[chunkhash:${ hashLength }].css`),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity,
    }),
    new WebpackAssetsManifest({
      customize: (key, val) => {
        return {
          key,
          value: val.replace('public/', ''),
        };
      },
      output: './public/manifest.json',
      publicPath: '/',
      writeToDisk: true,
    }),

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
  ],
  resolve: {
    // ensure any symlinked paths resolve to current repo
    symlinks: false,
  },
  stats: {
    chunks: false,
    colors: true,
    modules: false,
  },
  watch: flags.dev,
};

module.exports = conf;
