/*globals define*/

define( [
    'src/models/BaseModel'
  ], function(
    BaseModel
  ) {

'use strict';

var Model = BaseModel.extend({
  name:         'Menu',
  idAttribute:  'MenuId',

  // you should override fields definition when creating your own
  fields: undefined
});

  return Model;
});
