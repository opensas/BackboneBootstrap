/*globals define, console*/

define(
  ['jquery'],
  function( $ ) {

'use strict';

var toastMessage = {

  inprocess: 0,

  init: function(options){
    this.container = options.container;
  },

  update: function() {
    if (this.inprocess > 0) {
      $(this.container).show();
    } else {
      $(this.container).css('display','none');
    }
  },

  addProcess: function(){
    this.inprocess ++;
    this.update();
  },

  removeProcess: function(){
    this.inprocess --;
    if (this.inprocess < 0) {
      console.log('Error! toastMessage.inprocess < 0');
    }
    this.update();
  }

};

return toastMessage;
});