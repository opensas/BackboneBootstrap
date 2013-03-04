/*globals define*/

define( [
    'src/controllers/CrudChildController',
    'app/models/ReviewModel',
    'app/models/ReviewCollection'
  ], function(
    CrudChildController,
    ReviewModel,
    ReviewCollection
  ) {

'use strict';

ReviewModel.prototype.tableFields = ['id', 'author', 'date'];

var Controller = CrudChildController.extend({
  Model      : ReviewModel,
  Collection : ReviewCollection
});

  return Controller;
});
