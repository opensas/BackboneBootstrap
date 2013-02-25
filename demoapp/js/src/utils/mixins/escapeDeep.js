/*globals define*/

define( [
    'lodash'
  ], function(
    _
  ) {

'use strict';

var mixin = {};

  _.mixin({
    'escapeDeep': function(object) {
      // trivial case
      if (!_.isObject(object)) return _.escape(object);

      var escaped = {};
      // recursive call
      for (var prop in object) {
        escaped[prop] = _.escapeDeep(object[prop]);
      }
      return escaped;
    }
  });

  return mixin;
});
