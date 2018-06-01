require('babel-core/register')({
  presets: ['env', 'stage-2'],
  plugins: ['transform-decorators-legacy'],
});
require('babel-polyfill');
require('./server');
