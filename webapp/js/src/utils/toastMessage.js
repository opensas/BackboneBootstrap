/*globals define*/
'use strict';

define(
  ['jquery'],
  function( $ ) {

var toastMessage = {

  inprocess = 0,

  init = function(options){
    this.container = options.container;
  },

  addProcess = function(value){
    this.inprocess += value;

    if (this.inprocess > 0) {
      $(this.container).show();
    } else {
      $(this.container).css('display','none');
    }
  }

};

return toastMessage;
});