/*globals define, window, app*/

define( [
    'lodash', 'src/BaseObject'
  ], function(
    _, BaseObject
  ){

'use strict';

var BaseController = BaseObject.extend({

  resource: undefined,

  permissions: undefined,

  initialize: function(options) {

    options = options || {};

    _.defaults(this, options);

    //assert(window.app, 'window.app not initialized.');

    if (this.resource !== undefined) this.resource = this.resource.toLowerCase();

    this.permissions = this.permissions || [];

  },

  start: function() {
    throw new Error('BaseController.start not implemented.');
  }

});

  return BaseController;
});
