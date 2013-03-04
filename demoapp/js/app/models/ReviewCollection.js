/*globals define, app*/

define( [
    'src/models/BaseCollection', 'app/models/ReviewModel'
  ], function(
    BaseCollection, Model
  ) {

'use strict';

var Collection = BaseCollection.extend({

  model: Model,

  name:   'Reviews',
  label:  'Reviews',

  url: app.endpoint + '/reviews',

  resource: 'review'   // to get permissions from meta

});

  return Collection;
});
