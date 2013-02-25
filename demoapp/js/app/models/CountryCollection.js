/*globals define, app*/

define( [
    'src/models/BaseCollection', 'app/models/CountryModel'
  ], function(
    BaseCollection, Model
  ) {

'use strict';

var Collection = BaseCollection.extend({

  model: Model,

  name:   'Countries',
  label:  'Countries',

  url: app.endpoint + '/countries',

  resource: 'country'   // to get permissions from meta

});

  return Collection;
});
