/*globals define*/

define( [
    'jquery'
  ], function(
    $
  ) {

'use strict';

var html = {};

html.enable = function(selector, value) {
  if (value === undefined) value = true;
  var elem = $(selector);

  if (value === true ) {
    elem.removeAttr('disabled');
    elem.removeClass('disabled');
    if (selector.prop('tagName') === 'A') {
      selector.unbind('click');
    }
  } else {
    elem.attr('disabled', 'disabled');
    elem.addClass('disabled');
    if (selector.prop('tagName') === 'A') {
      selector.click(function(e) {
        e.preventDefault();
      });
    }
  }
};

html.disable = function(selector) {
  html.enable(selector, false);
};

// check http://stackoverflow.com/questions/1354064/how-to-convert-characters-to-html-entities-using-plain-javascript
html.encode = function(text) {
  var escaped = text.replace(/[\u00A0-\u00FF\u2022-\u2135]/g, function(c) {
     return '&#' + c.charCodeAt(0) + ';';
  });
  return escaped;
};

  return html;
});
