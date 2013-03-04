/*globals define*/

define( [
    'lodash', 'src/utils/mixins/merge'
  ], function(
    _, _merge
  ) {

'use strict';

var env = {};

/**
 * Loads the configuration from an environemnt.
 *
 * Each environments may be based on another one.
 *
 * By default, every environment is based on 'common'.
 *
 * @param     {envs} object with ALL the different environments
 * @param     {envName} the name of the desired environment
 *
 * @return    returns the content of the specified environemnt
 *            plus the information from every base environment
 *
 * environments = {
 *
 *  common: {
 *    name: 'Application name',
 *    port: 80,
 *    debug: false
 *  },
 *
 *  prod: {
 *    port: 8080
 *  }
 *
 *  devel: {
 *    debug: true
 *  },
 *
 *  devel2: {
 *    base: devel,
 *    port: 9000
 *  }
 *
 * }
 *
 * env.load(environments, 'devel2') should return
 *
 *  {
 *    name: 'Application name',
 *    port: 9000,
 *    debug: true
 *  }
 *
 */
env.load = function(environments, environmentName) {

  // base environment name
  // common by default
  var environment = environments[environmentName];
  if (environment === undefined) {
    throw new Error('Environment "' + environmentName + '" not found.');
  }

  var baseName = environment.base || 'common';
  var base;

  // avoid recursive dependencies
  if (environmentName === baseName) {
    base = {};
  } else {
    if (environment) {
      //recursively load dependencies
      base = env.load(environments, baseName);
    } else {
      base = {};
    }
  }

  return _.merge(environment, base);
};

  return env;
});
