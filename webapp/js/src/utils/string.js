/*globals define*/
'use strict';

define(
  ['lodash'],
  function( _ ) {

var string = {};

string.replaceAll = function(text, search, replace, caseSensitive) {
  caseSensitive = (caseSensitive === undefined ? false : caseSensitive);
  var options = 'g' + (caseSensitive ? '' : 'i');
  var r = new RegExp(search, options);
  return text.replace(r, replace);
}

// Usage example: 
//   repl( '<input type="text" class="span%s">', ' class="span%s"', '8') =>
//   '<input type="text" class="span8">'
// 
//   repl( '<input type="text" class="span%s">', ' class="span%s"', '') =>
//   '<input type="text">'
string.repl = function(template, placeHolder, value, emptyTemplate) {
  emptyTemplate = emptyTemplate || '';
  if (value) {
    var newPlaceHolder = string.replaceAll(placeHolder, "%s", value);
    return string.replaceAll(template, placeHolder, newPlaceHolder, true);
  } else {
    return string.replaceAll(template, placeHolder, emptyTemplate, true);
  }
}

  return string;
});
