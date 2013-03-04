/*globals define*/

define( [
    'lodash'
  ], function(
    _
  ) {

'use strict';

var mixin = {};

  _.mixin({
    findBy: function(collection, prop, value) {
      return _.find(collection, function(item) {
        return item[prop] === value;
      });
    }
  });

  return mixin;
});
