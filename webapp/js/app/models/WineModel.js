/*globals define*/
'use strict';

define(
  ['backbone', 'src/models/BaseModel'],
  function(Backbone, BaseModel) {

var WineModel = BaseModel.extend({
  defaults: {
    'id'          : null,
    'name'        : 'new wine',
    'grapes'      : '',
    'country'     : '',
    'region'      : '',
    'description' : 'enter the wine\'s description',
    'year'        : 2000
  },
  formFields: [
    { field: 'id', readOnly: true, label: 'Id', help: 'Automatically generated', control: 'id' },
    { field: 'name',        span: 6, label: 'Name',         help: 'Enter your name' },
    { field: 'grapes',      span: 8, label: 'Grapes',       help: 'Enter the wines grapes' },
    { field: 'country',     span: 8, label: 'Country',      help: 'Enter the wines country' },
    { field: 'region',      span: 8, label: 'Region',       help: 'Enter the wines region' },
    { field: 'year',        span: 8, label: 'Year',         help: 'Enter the wines year' },
    { field: 'description', span: 8, label: 'Description',  help: 'Enter the wines description', control: 'textarea', rows: 4 }
  ]
});

  return WineModel;
});