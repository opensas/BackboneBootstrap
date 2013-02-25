/*globals require*/
'use strict';

// Set the require.js configuration file for your application
require.config({

  baseUrl: '.',

  deps: ['main'],

  paths: {
    'src': '..',
    'jasmine':      'lib/jasmine-1.3.1/jasmine.min',
    'jasmine-html': 'lib/jasmine-1.3.1/jasmine-html.min',
    'lib':          '../../lib',
    'jquery':       '../../lib/jquery-1.9.0.min',
    'lodash':       '../../lib/lodash-1.0.0-rc.3.min'
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
