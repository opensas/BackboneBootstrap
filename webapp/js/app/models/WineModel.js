/*globals define*/

define( [
    'backbone', 'src/models/BaseModel'
  ], function(
    Backbone, BaseModel
  ) {

'use strict';

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
    { field: 'id', readOnly: true, span: 1, label: 'Id', help: 'Automatically generated', control: 'id' },
    { field: 'name',        span: 3, label: 'Name',         help: 'Enter your name' },
    { field: 'grapes',      span: 3, label: 'Grapes',       help: 'Enter the wines grapes' },
    { field: 'country',     span: 3, label: 'Country',      help: 'Enter the wines country' },
    { field: 'region',      span: 3, label: 'Region',       help: 'Enter the wines region' },
    { field: 'year',        span: 2, label: 'Year',         help: 'Enter the wines year' },
    { field: 'description', span: 6, label: 'Description',  help: 'Enter the wines description', control: 'textarea', rows: 4 }
  ],

  queryFields: [
    { field: 'id',          span: 1, label: 'Id',           help: 'Automatically generated' },
    { field: 'name',        span: 2, label: 'Name',         help: 'Enter your name' },
    { field: 'country',     span: 2, label: 'Country',      help: 'Enter the wines country' },
    { field: 'year',        span: 2, label: 'Year',         help: 'Enter the wines year' }
  ]

});

  return WineModel;
});