/*globals define*/
'use strict';

define(
  function() {

var convert = {};

convert.isNumber = function(value) {
  return !isNaN(parseFloat(value)) && isFinite(value);
}

  return convert;
});
