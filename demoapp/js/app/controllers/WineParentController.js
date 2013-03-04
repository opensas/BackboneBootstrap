/*globals define*/

define( [
    'src/controllers/CrudParentController',
    'app/controllers/ReviewChildController',
    'app/models/WineCollection'
  ], function(
    CrudParentController,
    ReviewChildController,
    WineCollection
  ) {

'use strict';

var Controller = CrudParentController.extend({
  Collection    : WineCollection,
  children:     [
    ReviewChildController
  ]
});

  return Controller;
});
