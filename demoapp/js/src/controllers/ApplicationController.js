/*globals define, app, window*/

define( [
    'jquery', 'lodash',
    'src/controllers/BaseController'
  ], function(
    $, _,
    BaseController
  ){

'use strict';

var Controller = BaseController.extend({

  baseUrl: '',

  initialize: function(options) {
    var self = this;

    options = options || {};
    this.previousHash = window.location.hash;

    _.extend(this, options);

    // super.initialize
    BaseController.prototype.initialize.call(this, options);

    this.el = options.el || this.el || '#controller-container';
    if (!this.el) throw new Error('el variable not specified!');

    // manually force a reload on hash change
    // to precent memory leaks
    window.onhashchange = function () {
      window.location.reload(true);
    };

  },

  start: function() {},

  success: function(message) { return app.layoutController.success(message); },
  info:    function(message) { return app.layoutController.info(message); },
  error:   function(message) { return app.layoutController.error(message); },
  warning: function(message) { return app.layoutController.warning(message); },

  modalMessage:       function(message, callback) {
    app.layoutController.modalMessage(message, callback);
  },
  modalError:         function(message, callback) {
    app.layoutController.modalError(message, callback);
  },
  modalConfirm:       function(message, callback) {
    app.layoutController.modalConfirm(message, callback);
  },
  modalConfirmDelete: function(message, callback) {
    app.layoutController.modalConfirmDelete(message, callback);
  }

});

  return Controller;
});
