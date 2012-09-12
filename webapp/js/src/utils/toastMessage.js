/*globals define*/
'use strict';

define(
  ['jquery'],
  function( $ ) {
  	

var toastMessage = {};  


toastMessage.inprocess = 0;

toastMessage.init = function(config){
	this.container = config.container;
};

toastMessage.addProcess = function(value){
	this.inprocess += value ;
	
	if (this.inprocess > 0)
		$(this.container).show();
	else
		$(this.container).css('display','none'); 	
	 
};


return toastMessage;

});