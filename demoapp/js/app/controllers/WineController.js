/*globals define*/

define( [
    'src/controllers/CrudController',
    'app/models/WineCollection'
  ], function(
    CrudController,
    WineCollection
  ) {

'use strict';

var WineController = CrudController.extend({
  Collection: WineCollection
});

  return WineController;
});
