const TARGET = process.env.npm_lifecycle_event;
if (TARGET === 'build-dev') {
  module.exports = require('./webpack.config.dev.js');
}
if (TARGET === 'build-prod') {
  module.exports = require('./webpack.config.prod.js');
}
