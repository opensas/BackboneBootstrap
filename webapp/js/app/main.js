/*globals require, app*/
require( [
    'jquery', 'bootstrap', 'app/routers/WineRouter', 'app/routers/CountryRouter'
  ], function(
    $, bootstrap, WineRouter, CountryRouter
  ) {

'use strict';

window.app = window.app || {};

$(function() {
  // app = new WineRouter();
  app = new CountryRouter();
  app.navigateToList();
});

});