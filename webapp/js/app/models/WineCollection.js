/*globals define*/
'use strict';

define(
  ['backbone', 'src/models/BaseCollection', 'app/models/WineModel'],
  function(Backbone, BaseCollection, WineModel) {

var WineCollection = BaseCollection.extend({
  
  model: WineModel,
  
  tableFields: [
    {field: 'id',       label: 'N',       order: false},
    {field: 'name',     label: 'Name',    order: 'name'},
    {field: 'grapes',   label: 'Grapes'},
    {field: 'country',  label: 'Country'},
    {field: 'region',   label: 'Region'},
    {field: 'year',     label: 'Year'}
  ]
});

  return WineCollection;
})