/*globals define*/

define( [
    'src/BaseApp', 'src/utils/env'
  ], function(
    BaseApp, env
  ) {

'use strict';

// var environment = 'prod';
var environment = 'devel';

var environments = {

  // properties common to all environments, might be overwritten by a particular environment
  common: {
    name: 'BackboneBootstrapDemo',
    version: '0.0.1',

    meta: {
      application: 'demo',
      mock: false
    },

    menu: {
      mock: false
    }

  },

  prod: {
    mode: 'prod',
    rootUrl: '/app/index.html',
    endpoint: 'https://bb-jugar.rhcloud.com/api',

    meta: {
      endpoint: 'http://wsssc/rest.asp?'
    }
  },

  devel: {
    mode: 'devel',
    rootUrl: '/index.html#',
    endpoint: 'http://localhost:9000/api',
    ws: 'scala',

    meta: {
      endpoint: 'http://nikita2/ws-ssc/rest.asp?',
      mock: true
    }
  }
};

var options = env.load(environments, environment);

options.menuModule = 'app/models/MenuCollection';

  return new BaseApp(options);

});
