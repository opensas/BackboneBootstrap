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
    'requireLib' :   'lib/require.min',
    // Libraries
    jquery       :'lib/jquery-1.8.1.min',
    lodash       :'lib/lodash-0.6.0.min',
    backbone     :'lib/backbone-0.9.2.min',
    bootstrap    :'lib/bootstrap.min',
    // requirejs plugin
    text         : 'lib/text.min'
  },
  name    : 'app/main',
  include : ['requireLib'],
  // exclude: ['jquery', 'lodash'],
  shim: {
    backbone: {
      deps    : ['lodash', 'jquery'],
      exports : 'Backbone'
    },
    bootstrap: {
      deps: ['jquery']
    }
  }
});
