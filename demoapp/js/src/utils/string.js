/*globals define*/

define([
    'lodash'
  ], function(
    _
  ) {

'use strict';

var string = {};

/**
 * [replaceAll description]
 * @param  {String} text            [description]
 * @param  {String} search          [description]
 * @param  {String} replace         [description]
 * @param  {Boolean} caseSensitive  [description]
 * @return {String}                 [description]
 */
string.replaceAll = function(text, search, replace, caseSensitive) {
  caseSensitive = (caseSensitive === undefined ? false : caseSensitive);
  var options = 'g' + (caseSensitive ? '' : 'i');
  var r = new RegExp(search, options);
  return text.replace(r, replace);
};

// Usage example:
//   repl( '<input type="text" class="span%s">', ' class="span%s"', '8') =>
//   '<input type="text" class="span8">'
//
//   repl( '<input type="text" class="span%s">', ' class="span%s"', '') =>
//   '<input type="text">'

string.isEmpty = function(value) {
  return _.isString(value) && value.trim().length === 0;
};

// helper function to format strings
string.format = function(text) {
  var args = arguments;
  return text.replace(/\{(\d+)?\}/g, function(match, number) {
    var pos = parseInt(number, 10);
    return args[pos] === undefined ? match : args[pos];
  });
};

string.capitalize = function(text) {
  if (!_.isString(text)) throw new TypeError('text should be a string');
  if (text.length <=1) return text.toUpperCase();

  return text.substr(0,1).toUpperCase() + text.substr(1);
};

string.startsWith = function(text, start) {
  if (text.length < start.length) return false;
  return text.substr(0, start.length) === start;
};

  return string;
});
