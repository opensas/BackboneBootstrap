/*globals require*/
require(
  ['jquery', 'src/routers/wine'],
  function( $, Router ) {

'use strict';
window.app = window.app || {};

$(function() {

  app = new Router();

  app.navigate('wines');

});

});