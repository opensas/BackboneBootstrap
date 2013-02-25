/*globals define*/

define( [
    'src/controllers/ApplicationController'
  ], function(
    ApplicationController
  ) {

'use strict';

var Controller = ApplicationController.extend({
  resource      : 'ComprasGestion'
});

  return Controller;
});