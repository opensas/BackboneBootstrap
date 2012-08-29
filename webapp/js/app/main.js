/*globals require*/
require(
  ['jquery', 'bootstrap', 'src/routers/wine'],
  function( $, bootstrap, Router ) {

'use strict';
window.app = window.app || {};

$(function() {

  app = new Router();

  app.navigate('wines');

});

});