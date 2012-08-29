/*globals define*/
'use strict';

define(
  ['jquery'],
  function( $ ) {

var accessibility = {};

accessibility.colorBlind = function() {
  $('*').css('color','black');
  $('div.navbar-inner').css('background-color','white');
  $('* a:hover').css('color','black');
};

accessibility.resizeText = function(multiplier) {
  if (document.body.style.fontSize === '') {
    document.body.style.fontSize = "1.0em";
  }
  document.body.style.fontSize = parseFloat(document.body.style.fontSize) + (multiplier * 0.2) + "em";
};

  return accessibility;
});