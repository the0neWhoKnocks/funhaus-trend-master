var path = require('path');

module.exports = {
  app: {
    title: 'Funhaus Trend Master',
  },
  PORT: 8081,
  paths: {
    PUBLIC: path.resolve(`${__dirname}/public`),
    ROOT: path.resolve(`${__dirname}/`),
  }
};