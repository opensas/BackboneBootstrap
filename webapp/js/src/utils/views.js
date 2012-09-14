/*globals define*/

define(
  ['lodash'],
  function( _ ) {

'use strict';

var views = {};

views.compileTemplate = function(template) {
  // a string has been passed as a template, have to compile it
  if (_.isString(template)) {
    return _.template(template);

  // a function has been passed as a template, no need to compile it
  } else if (_.isFunction(template)) {
    return template;
  } else {
    throw new Error('Invalid template specified. Should be a function or a string.');
  }
};

  return views;
});
