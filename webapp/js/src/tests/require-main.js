/*globals require*/
'use strict';

// Set the require.js configuration file for your application
require.config({

  baseUrl: '.',

  deps: ['main'],

  paths: {
    'src': '..',
    'jasmine':      'lib/jasmine-1.2.0/jasmine.min',
    'jasmine-html': 'lib/jasmine-1.2.0/jasmine-html.min',
    'lib':          '../../lib',
    'jquery':       '../../lib/jquery-1.8.1.min',
    'lodash':       '../../lib/lodash-0.6.0.min'
  },

  shim: {
    jasmine: {
      deps: ['jquery'],
      exports: 'jasmine'
    },
    'jasmine-html': {
      deps: ['jasmine'],
      exports: 'jasmine-html'
    }
  }

});