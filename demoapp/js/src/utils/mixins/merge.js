/*globals define*/

define( [
    'lodash'
  ], function(
    _
  ) {

'use strict';

var mixin = {};

// recursively merge two objects
var merge = function(o1, o2) {
  var o = _.clone(o1);

  for (var prop in o2) {
    if (o[prop] === undefined) {
      o[prop] = o2[prop];
    }
    if (_.isObject(o[prop])){
      o[prop] = merge(o[prop], o2[prop]);
    }
  }
  return o;
};

_.mixin({
  'merge': merge
});

  return mixin;
});
