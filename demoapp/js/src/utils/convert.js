/*globals define, app*/

define( [
    'lodash'
  ], function(
    _
  ) {

'use strict';

var convert = {};

convert.defaultDateFormat     = 'dd-mm-yyyy';
convert.defaultDateTimeFormat = 'dd-mm-yyyy HH:mm:ss';
convert.defaultTimeFormat     = 'HH:mm:ss';

convert.ESC_REG_EX            = /[\-{}\[\]+?.,\\\^$|#\s]/g;

convert.basicType = function(value) {
  if      (_.isString(value))     return 'string';
  else if (_.isNumber(value))     return 'number';
  else if (_.isBoolean(value))    return 'boolean';
  else if (_.isDate(value))       return 'date';
  else if (_.isNull(value))       return 'null';
  else if (_.isUndefined(value))  return 'undefined';
  else                            return 'unknown';
};

convert.convert = function(value, type) {

  switch (type.toLowerCase()) {
  case 'string':
    return convert.toString(value);

  case 'number':
    return convert.toNumber(value, null);

  case 'boolean':
    return convert.toBoolean(value, null);

  case 'date':
    return convert.toDate(value, null);

  default:
    throw new Error('type "' + type + '" not supported!');
    // return null;

  }
};

convert.format = function(value, options) {
  var type = convert.basicType(value).toLowerCase();

  options = options || {};

  switch (convert.basicType(value)) {
  case 'string':
    return value;

  case 'number':
    return value.toString();

  case 'boolean':
    return convert.formatBoolean(value);

  case 'date':
    return value.toString();

  case 'null':
  case 'undefined':
    return '';

  default:
    throw new Error('type "' + type + '" not supported!');
  }
};

convert.toString = function(value) {
  return value.toString();
};

convert.toNumber = function(value, def) {

  try {
    if (_.isNumber(value)) return value;
    var ret = parseInt(value.toString(), 10);

    if (_.isNumber(ret) && !_.isNaN(ret)) return ret;
    return def;

  } catch(e) {
    return (def === undefined ? null : def);
  }

};

convert.toBoolean = function(value, def) {

  if (value === null || value === undefined || value === NaN) value = '';

  var compare     = value.toString().toLowerCase(),
      trueValues  = ['true', '1', '-1', 'yes', 'on', 'si', 'sí'],
      falseValues = ['false', '0', 'no', 'off'];

  if (_.contains(trueValues, compare)) return true;
  if (_.contains(falseValues, compare)) return false;

  return (def === undefined ? null : def);
};

convert.toDate = function(value, def) {

  var dateParsed = convert.parseDate(value);

  if (!dateParsed) return (def === undefined ? null : def);

  return new Date(dateParsed[0], dateParsed[1], dateParsed[2]);
};

convert.parseDate = function(date) {

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

convert.isValidDate = function(date) {
  return convert.parseDate(date) !== null;
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
convert.isNumeric = function(value) {
  return !isNaN(parseFloat(value)) && isFinite(value);
};

convert.formatBoolean = function(value, trueValue, falseValue, undefValue) {

  trueValue   = (trueValue === undefined ? 'Sí' : trueValue);
  falseValue  = (falseValue === undefined ? 'No' : falseValue);
  undefValue  = (undefValue === undefined ? '' : undefValue);

  var booleanValue = convert.toBoolean(value);

  if      (booleanValue === true)   return trueValue;
  else if (booleanValue === false)  return falseValue;
  else                              return undefValue;

};

// escapa los caracteres especiales de expresiones regulares
convert.escapeRegExp = function(value) {
  return value.replace(convert.ESC_REG_EX, "\\$&");
};

  return convert;
});
