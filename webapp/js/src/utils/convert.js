/*globals define*/

define(
  function() {

'use strict';

var convert = {};

convert.isNumber = function(value) {
  return !isNaN(parseFloat(value)) && isFinite(value);
};

  return convert;
});
