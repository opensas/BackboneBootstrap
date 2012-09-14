/*globals define*/

define( [
    'backbone', 'src/routers/CrudRouter',
    'app/config', 'app/models/WineModel', 'app/models/WineCollection',
    'text!app/views/wines/wineForm.html', 'text!app/views/wines/wineQuery.html'
  ], function(
    Backbone, CrudRouter,
    config, WineModel, WineCollection,
    wineFormTemplate, wineQueryTemplate
  ) {

'use strict';

var Router = CrudRouter.extend({
  config        : config,
  Model         : WineModel,
  Collection    : WineCollection,
  // formTemplate  : wineFormTemplate, // uncomment to see the custom form template in action
  queryTemplate : wineQueryTemplate, // uncomment to see the custom form template in action
  baseUrl       : 'wines'
});

  return Router;
});