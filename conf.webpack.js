const yargs = require('yargs');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const WebpackAssetsManifest = require('webpack-assets-manifest');
const TidyPlugin = require('./.webpack/TidyPlugin');

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
  entry: {
    'app': [
      './src/app',
    ],
    'vendor': [
      'regenerator-runtime/runtime',
    ],
  },
  output: {
    filename: `./public/js/[name].[hash:${ hashLength }].js`,
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
            presets: [
              ['babel-preset-env', {
                targets: {
                  browsers: ['chrome >= 39']
                }
              }]
            ],
          }
        }
      },
      {
        test: /\.styl$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'stylus-loader']
        }),
      }
    ]
  },
  plugins: [
    new TidyPlugin({
      cleanPaths: './public/js/* ./public/css/*',
      hashLength,
      watching: flags.dev,
    }),
    new ExtractTextPlugin(`./public/css/[name].[hash:${ hashLength }].css`),
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
  stats: {
    modules: false,
  },
  watch: flags.dev,
};

module.exports = conf;
