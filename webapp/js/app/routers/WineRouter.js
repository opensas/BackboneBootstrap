/*globals define*/
'use strict';

define(
  [
    'backbone', 'src/routers/CrudRouter',
    'app/config', 'app/models/WineModel', 'app/models/WineCollection',
    'app/views/wines/RowsView', 'app/views/wines/FormView'
  ],
  function(Backbone, CrudRouter,
    config, WineModel, WineCollection,
    RowsView, FormView
    ) {

var Router = CrudRouter.extend({
  config: config,
  Model: WineModel,
  Collection: WineCollection,
  RowsView: RowsView,
  FormView: FormView,
  baseUrl: 'wines'
});

  return Router;
});