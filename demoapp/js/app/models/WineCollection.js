/*globals define, app*/

define( [
    'src/models/BaseCollection', 'app/models/WineModel'
  ], function(
    BaseCollection, Model
  ) {

'use strict';

var Collection = BaseCollection.extend({

  model: Model,

  name:   'Wines',
  label:  'Wines',

  url: app.endpoint + '/wines',

  resource: 'wine'   // to get permissions from meta

});

  return Collection;
});
