/*globals describe,beforeEach,it,expect*/

define(
  ['jasmine', 'src/utils/convert', 'jasmine'],
  function(jasmine, convert) {

'use strict';

describe("utils.convert.isNumber helper", function() {

  var isNumber = convert.isNumber,
      value, expected;

  describe("when a string representing a number is passed", function() {
    it("it should return true", function() {

      expect(isNumber('123')).toEqual(true);

    });
  });

  describe("when a string that is not a number is passed", function() {
    it("it should return false", function() {

      expect(isNumber('Hi everybody')).toEqual(false);

    });
  });

  describe("when a Boolean is passed", function() {
    it("it should return false", function() {

      expect(isNumber(true)).toEqual(false);
      expect(isNumber(false)).toEqual(false);

    });
  });

  describe("when an empty (falsy) value is passed", function() {
    it("it should return false", function() {

      expect(isNumber(false)).toEqual(false);
      expect(isNumber(undefined)).toEqual(false);
      expect(isNumber(null)).toEqual(false);
      expect(isNumber({})).toEqual(false);
      expect(isNumber('')).toEqual(false);
      expect(isNumber('    ')).toEqual(false);

    });
  });

  describe("when a valid number with sign and decimals is passed", function() {
    it("it should return true", function() {

      var values = ['0', '+0','-0', '0.0', '1.5', '-1.5', '+1.5', ' 14', '14 '];

      for (var i=0; i<values.length; i++) {
        expect(isNumber(values[i])).toEqual(true);
      }

    });
  });

  describe("when an invalid number is passed", function() {
    it("it should return false", function() {

      var values = ['--0', '++0', '1 0', '1+', '1-', '13.1.2', '13,1', '13..1'];

      for (var i=0; i<values.length; i++) {
        expect(isNumber(values[i])).toEqual(false);
      }

    });
  });

});


});