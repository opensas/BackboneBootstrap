/*globals define*/

define( [
    'src/controllers/CrudController',
    'app/models/CountryCollection'
  ], function(
    CrudController,
    CountryCollection
  ) {

'use strict';

var CountryController = CrudController.extend({
  Collection: CountryCollection
});

  return CountryController;
});
