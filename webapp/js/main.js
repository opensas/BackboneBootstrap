/*globals $,_,Backbone,utils,confirm,alert*/

var src = {};
var app = {};

$(function () {
  'use strict';

  app = new src.routers.wine();
  app.navigate('wines');

});