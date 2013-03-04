/*globals define*/

define( [
    'lodash'
  ], function(
    _
  ) {

'use strict';

var mixin = {};

  _.mixin({
    isPlainObject: function(object) {
      return typeof object == 'object' && object.constructor == Object;
    }
  });

  return mixin;
});
