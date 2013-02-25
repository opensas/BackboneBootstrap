/*globals define*/

define( [
    'jquery', 'lodash',
    'src/controllers/BaseController',
    'src/views/layout/LayoutView',
    'src/controls/menu/MenuView',
    'src/views/widgets/AccessibilityView',
    'src/utils/toastMessage',
    'src/utils/notificationManager',
    'src/controls/modal/modal'
  ], function(
    $, _,
    BaseController,
    LayoutView,
    MenuView,
    AccessibilityView,
    toastMessage,
    notificationManager,
    modal
  ){

'use strict';

var Controller = BaseController.extend({

  initialize: function(options) {

    options = options || {};

    _.extend(this, options);

    // super.initialize
    BaseController.prototype.initialize.call(this, options);

    this.el = this.el || 'body';
    if (!this.el) { throw new Error('View.el not specified!'); }
    this.$el = $(this.el);

    this.layoutView = new LayoutView({
      el:           this.el,
      controller:   this
    });
    this.layoutView.render();

    this.menuCollection = this.menuCollection || undefined;
    if (!this.menuCollection) { throw new Error('menuCollection not specified!'); }

    // it wil be rendered when the MenuCollection is fetched
    this.menuView = new MenuView({
      el:           '#main-menu-view',
      controller:   this,
      collection:   this.menuCollection
    });

    this.accessibilityView = new AccessibilityView({
      el:           '#accessibility-view',
      controller:   this
    }).render();

    // initialize NotificationManager
    notificationManager.initialize( {
      position:       'top-right',    // 'top-right', 'bottom-left', 'bottom-right', 'top-left', 'top-right'
      fade_in_speed:  'medium',       // string or int
      fade_out_speed: 'medium',       // string or int
      time:           3000            // milliseconds
    });

    toastMessage.initialize({
      el        : '.loading',
      elMessage : '.loading span'
    });

    this.loadingView = toastMessage;

  },

  start: function() {
    this.menuCollection.setParams({ len: 1000 })
    this.menuCollection.fetch();
  },

  alert: function(message) {
    notificationManager.addNotification(message, 'alert');
  },

  error: function(message) {
    notificationManager.addNotification(message, 'error');
  },

  info: function(message) {
    notificationManager.addNotification(message, 'info');
  },

  success: function(message) {
    notificationManager.addNotification(message, 'success');
  },

  warning: function(message) {
    notificationManager.addNotification(message, 'warning');
  },

  modalMessage: function(message) {
    modal.message(message);
  },

  modalError: function(message) {
    modal.error(message);
  },

  modalConfirm: function(message, callback) {
    modal.confirm(message, callback);
  },

  modalConfirmDelete: function(message, callback) {
    modal.confirmDelete(message, callback);
  },

  startLoading: function(message) {
    this.loadingView.addProcess(message);
  },

  completeLoading: function(message) {
    this.loadingView.removeProcess();
  }

});

  return Controller;
});
