/*globals define, app, require, requirejs, console*/

define( [
    'lodash', 'backbone'
  ], function (
    _, Backbone
  ){

'use strict';

/**
 * Base object to use for every non-Backbone inherited object.
 *
 * It just provides an initialize method and the extend class method
 * borrowed from Backbone.Model.extend
 *
 * @param {Object} options Initialization options object
 */
var BaseObject = function(options) {
  this.initialize.apply(this, arguments);
};

_.extend(BaseObject.prototype, {

  initialize: function(options) {}

});

  // The self-propagating extend function that Backbone classes use.
  BaseObject.extend = Backbone.Model.extend;

  return BaseObject;
});
