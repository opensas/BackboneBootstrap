/*globals $,_,Backbone,utils,confirm,alert*/

var src = src || {};
var app = app || {};

$(function () {
  'use strict';

  app = new src.routers.wine();
  app.navigate('wines');

});