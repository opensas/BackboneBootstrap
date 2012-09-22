/*globals define*/

define( [
    'backbone', 'src/models/BaseCollection', 'app/models/CountryModel'
  ], function(
    Backbone, BaseCollection, CountryModel
  ) {

'use strict';

var CountryCollection = BaseCollection.extend({

  model: CountryModel,

  tableFields: [
    {field: 'id',       label: 'N'},
    {field: 'code',     label: 'Code'},
    {field: 'name',     label: 'Name'}
  ]

});

  return CountryCollection;
});