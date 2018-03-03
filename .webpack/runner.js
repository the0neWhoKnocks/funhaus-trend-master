const webpack = require('webpack');
const conf = require('./conf.webpack');

// https://github.com/webpack/docs/wiki/node.js-api
webpack(conf, (err, stats) => {
  if( err ) throw err;
  console.log(stats.toString(conf.stats));
});
