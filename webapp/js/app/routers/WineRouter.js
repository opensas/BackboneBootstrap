/*globals define*/

define( [
    'backbone', 'src/routers/CrudRouter',
    'app/config', 'app/models/WineModel', 'app/models/WineCollection',
    'text!app/views/wines/wineForm.html'
  ], function(
    Backbone, CrudRouter,
    config, WineModel, WineCollection,
    wineFormTemplate
  ) {

'use strict';

var Router = CrudRouter.extend({
  config          : config,
  Model           : WineModel,
  Collection      : WineCollection,
  // formTemplate : wineFormTemplate, // uncomment to see the custom form template in action
  baseUrl         : 'wines'
});

  return Router;
});