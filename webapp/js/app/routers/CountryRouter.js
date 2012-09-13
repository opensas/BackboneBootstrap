/*globals define*/
'use strict';

define(
  [
    'backbone', 'src/routers/CrudRouter',
    'app/config', 'app/models/CountryModel', 'app/models/CountryCollection'
  ],
  function(Backbone, CrudRouter,
    config, CountryModel, CountryCollection
  ) {

var Router = CrudRouter.extend({
  config: config,
  Model: CountryModel,
  Collection: CountryCollection,
  baseUrl: 'countries'
});

  return Router;
});