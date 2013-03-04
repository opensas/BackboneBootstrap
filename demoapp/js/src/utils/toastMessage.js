/*globals define, console*/

define([
    'jquery'
  ], function(
    $
  ) {

'use strict';

var toastMessage = {

  inprocess: 0,

  initialize: function(options) {
    this.el = options.el;
    if (!this.el) throw new Error('toastMessage.el not defined');

    this.$el = $(this.el);

    this.elMessage = options.elMessage;
    if (this.elMessage) this.$elMessage = $(this.elMessage);

    this.message = options.message || 'Cargando...';
  },

  update: function(message) {
    message = message || this.message;
    if (this.inprocess > 0) {
      if (this.$elMessage) this.$elMessage.text(message);
      this.$el.show();
    } else {
      this.$el.hide();
    }
  },

  addProcess: function(message){
    this.inprocess ++;
    this.update(message);
  },

  removeProcess: function(){
    this.inprocess --;
    if (this.inprocess < 0) console.log('Error! toastMessage.inprocess < 0');
    this.update();
  }

};

  return toastMessage;
});
