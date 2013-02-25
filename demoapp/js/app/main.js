/*globals require, app*/
require( [
    'jquery', 'bootstrap', 'app/demoApp'
  ], function(
    $, bootstrap, app
  ) {

'use strict';

window.app = window.app || app;

$(function() {
  app.start(function(controller) {
    controller.start();
  });
});

});
