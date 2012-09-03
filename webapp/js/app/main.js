/*globals require*/
require(
  ['jquery', 'bootstrap', 'app/routers/WineRouter'],
  function( $, bootstrap, Router ) {

'use strict';
window.app = window.app || {};

$(function() {
  app = new Router();
  app.navigate('wines');
});

});