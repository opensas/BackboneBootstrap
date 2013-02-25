/*globals define, app*/

define( [
    'lodash'
  ], function(
    _
  ) {

'use strict';

var objects = {};

objects.defaultDateFormat     = 'dd-mm-yyyy';
objects.defaultDateTimeFormat = 'dd-mm-yyyy HH:mm:ss';
objects.defaultTimeFormat     = 'HH:mm:ss';

objects.ESC_REG_EX            = /[\-{}\[\]+?.,\\\^$|#\s]/g;

objects.basicType = function(value) {
  if      (_.isString(value))     return 'string';
  else if (_.isNumber(value))     return 'number';
  else if (_.isBoolean(value))    return 'boolean';
  else if (_.isDate(value))       return 'date';
  else if (_.isNull(value))       return 'null';
  else if (_.isUndefined(value))  return 'undefined';
  else                            return 'unknown';
};

objects.convert = function(value, type) {

  switch (type.toLowerCase()) {
  case 'string':
    return objects.toString(value);

  case 'number':
    return objects.toNumber(value, null);

  case 'boolean':
    return objects.toBoolean(value, null);

  case 'date':
    return objects.toDate(value, null);

  default:
    throw new Error('type "' + type + '" not supported!');
    // return null;

  }
};

objects.format = function(value, options) {
  var type = objects.basicType(value).toLowerCase();

  options = options || {};

  switch (objects.basicType(value)) {
  case 'string':
    return value;

  case 'number':
    return value.toString();

  case 'boolean':
    return objects.formatBoolean(value);

  case 'date':
    return value.toString();

  case 'null':
  case 'undefined':
    return '';

  default:
    throw new Error('type "' + type + '" not supported!');
  }
};

objects.toString = function(value) {
  return value.toString();
};

objects.toNumber = function(value, def) {

  try {
    if (_.isNumber(value)) return value;
    var ret = parseInt(value.toString(), 10);

    if (_.isNumber(ret) && !_.isNaN(ret)) return ret;
    return def;

  } catch(e) {
    return (def === undefined ? null : def);
  }

};

objects.toBoolean = function(value, def) {

  if (value === null || value === undefined || value === NaN) value = '';

  var compare     = value.toString().toLowerCase(),
      trueValues  = ['true', '1', '-1', 'yes', 'on', 'si', 'sí'],
      falseValues = ['false', '0', 'no', 'off'];

  if (_.contains(trueValues, compare)) return true;
  if (_.contains(falseValues, compare)) return false;

  return (def === undefined ? null : def);
};

objects.toDate = function(value, def) {

  var dateParsed = objects.parseDate(value);

  if (!dateParsed) return (def === undefined ? null : def);

  return new Date(dateParsed[0], dateParsed[1], dateParsed[2]);
};

objects.parseDate = function(date) {

  var regDate, matches, year, month, day, checkDate;

  //initial parse using regular expressions
  regDate = new RegExp(
    '^' +                                   // start of the expression
    '(0?[1-9]|[12][0-9]|3[01])[- /.]' +      // 1..31
    '(0?[1-9]|1[012])[- /.]' +               // 1..12
    '((?:19|20)?\\d\\d)' +                  // 19xx 20xx xx xx
    '$'),

  matches = regDate.exec(date.trim());

  if (!matches) return null;

  day   = parseInt(matches[1], 10);
  month = parseInt(matches[2], 10) - 1;
  year  = parseInt(matches[3], 10);

  // only two digits for year, complete it
  if (year < 1900) {
    if (year < 60)  year += 1900;
    else            year += 2000;
  }

  checkDate = new Date(year, month, day);

  // compare again with the new date to check if it was valid
  if ( year   === checkDate.getUTCFullYear() &&
       month  === checkDate.getUTCMonth() &&
       day    === checkDate.getUTCDate() ) {
    return [year, month + 1, day];
  }

  return null;
};

objects.isValidDate = function(date) {
  return objects.parseDate(date) !== null;
};

// false: no value no es ni integer ni float || value no es finito
/**
 * Returns true if the string passed represents a valid number
 *
 * See
 *
 * - http://stackoverflow.com/a/1830844
 *
 * @param  {string}  value The string value to check.
 * @return {Boolean}       True if value represents a valid number.
 */
objects.isNumeric = function(value) {
  return !isNaN(parseFloat(value)) && isFinite(value);
};

objects.formatBoolean = function(value, trueValue, falseValue, undefValue) {

  trueValue   = (trueValue === undefined ? 'Sí' : trueValue);
  falseValue  = (falseValue === undefined ? 'No' : falseValue);
  undefValue  = (undefValue === undefined ? '' : undefValue);

  var booleanValue = objects.toBoolean(value);

  if      (booleanValue === true)   return trueValue;
  else if (booleanValue === false)  return falseValue;
  else                              return undefValue;

};

// escapa los caracteres especiales de expresiones regulares
objects.escapeRegExp = function(value) {
  return value.replace(objects.ESC_REG_EX, "\\$&");
};

  return objects;
});
