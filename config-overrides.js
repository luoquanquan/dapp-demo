/* eslint-disable no-param-reassign */
// eslint-disable-next-line import/no-extraneous-dependencies
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
// eslint-disable-next-line import/no-extraneous-dependencies
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');

module.exports = function override(config, env) {
  config.ignoreWarnings = [/Failed to parse source map/];
  // eslint-disable-next-line no-console
  console.log('Current log: env: ', env);
  config.plugins.push(new NodePolyfillPlugin({
    excludeAliases: ['console'],
  }));

  // eslint-disable-next-line max-len
  // config.resolve.plugins = config.resolve.plugins.filter((plugin) => !(plugin instanceof ModuleScopePlugin));

  return config;
};
