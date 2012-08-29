/*globals require*/
'use strict';

// Set the require.js configuration file for your application
require.config({
  // Initialize the application with the main application file
  deps: ['app/main'],

  baseUrl: 'js',

  paths: {
    // Libraries
    jquery: 'lib/jquery-1.8.0',
    lodash: 'lib/lodash-0.6.0',
    backbone: 'lib/backbone-0.9.2',
    // requirejs plugin
    text: 'lib/text'
  },

  shim: {
    backbone: {
      deps: ['lodash', 'jquery'],
      exports: 'Backbone'
    }
  }
});
