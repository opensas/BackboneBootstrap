/*globals define*/

define( [
    'backbone', 'src/models/BaseCollection', 'app/models/WineModel'
  ], function(
    Backbone, BaseCollection, WineModel
  ) {

'use strict';

var WineCollection = BaseCollection.extend({
  
  model: WineModel,
  
  tableFields: [
    {field: 'id',       label: 'N',       order: 'id'},
    {field: 'name',     label: 'Name',    order: 'name'},
    {field: 'grapes',   label: 'Grapes'},
    {field: 'country',  label: 'Country'},
    {field: 'region',   label: 'Region'},
    {field: 'year',     label: 'Year'}
  ]
});

  return WineCollection;
});