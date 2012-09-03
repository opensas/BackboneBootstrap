/*globals define*/
'use strict';

define(
  ['backbone', 'src/models/BaseCollection', 'app/models/WineModel'],
  function(Backbone, BaseCollection, WineModel) {

var WineCollection = BaseCollection.extend({
  model: WineModel,
});

  return WineCollection;
})