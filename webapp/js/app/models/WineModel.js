/*globals define*/
'use strict';

define(
  ['backbone', 'src/models/BaseModel'],
  function(Backbone, BaseModel) {

var WineModel = BaseModel.extend({
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

  return WineModel;
});