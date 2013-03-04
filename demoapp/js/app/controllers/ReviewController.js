/*globals define*/

define( [
    'src/controllers/CrudController',
    'app/models/ReviewCollection'
  ], function(
    CrudController,
    ReviewCollection
  ) {

'use strict';

var ReviewController = CrudController.extend({
  Collection: ReviewCollection
});

  return ReviewController;
});
