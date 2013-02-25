/*globals beforeEach*/

define(
  ['jasmine'],
  function(jasmine) {

'use strict';

beforeEach(function() {

  this.addMatchers({
    toStartWith: function(text) {
      return (this.actual.indexOf(text) === 0);
    }
  });

  this.addMatchers({
    toEndWith: function(text) {
      // private helper function - don't want to mess with String prototype
      var endsWith = function(text, suffix) {
        return (text.indexOf(suffix, text.length - suffix.length) !== -1);
      };
      // return (this.actual.match(text+'$')!==null);
      return endsWith(this.actual, text);
    }
  });

});

});
