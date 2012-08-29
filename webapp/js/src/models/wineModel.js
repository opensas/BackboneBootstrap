/*globals define*/
'use strict';

define(
  ['backbone'],
  function( Backbone) {

var Wine = Backbone.Model.extend({
  defaults: {
    'id': null,
    'name': 'new wine',
    'grapes': '',
    'country': '',
    'region': '',
    'description': 'enter the wine\'s description',
    'year': 2000
  }
});

  return Wine;
});