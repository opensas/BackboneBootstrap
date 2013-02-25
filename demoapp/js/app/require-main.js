/*globals require*/
'use strict';

// Set the require.js configuration file for your application
require.config({

  // optimize: 'none',

  // Initialize the application with the main application file
  baseUrl: 'js',

  deps : ['app/main'],
  out  : 'main.min.js',

  preserveLicenseComments: false,

  paths: {
    // Embed require in main.min
    'requireLib' : 'lib/require.min',
    // Libraries
    jquery       : 'lib/jquery-1.9.1.min',
    jqueryui     : 'lib/jquery-ui-1.8.21.custom.min',
    gritter      : 'lib/jquery.gritter-1.7.4',
    lodash       : 'lib/lodash.underscore-1.0.1.min',
    // lodash       : 'lib/underscore-1.4.4.min',
    backbone     : 'lib/backbone-0.9.10',
    // backbone     :'lib/backbone-0.9.10.min',
    bootstrap    : 'lib/bootstrap.min',
    chai         : 'lib/chai-1.4.2.min',
    assert       : 'src/utils/assert',
    // requirejs plugin
    text         : 'lib/text-2.0.5.min'
  },
  name    : 'app/main',
  include : ['requireLib'],
  // exclude: ['jquery', 'lodash'],
  shim: {
    lodash: {
        exports: '_'
    },
    backbone: {
      deps    : ['lodash', 'jquery'],
      exports : 'Backbone'
    },
    bootstrap: {
      deps: ['jquery']
    },
    jqueryui: {
      deps: ['jquery']
    }
  }
});
