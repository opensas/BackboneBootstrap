/*globals define, app*/

define( [
    'lodash', 'moment'
  ], function(
    _, moment
  ) {

'use strict';

var convert = {};

convert.defaultDateFormat       = 'DD-MM-YYYY';
convert.defaultDateTimeFormat   = 'DD-MM-YYYY HH:mm:ss';
convert.defaultTimeFormat       = 'HH:mm:ss';

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

convert.to = function(value, type, options) {

  switch (type.toLowerCase()) {
  case 'string':
    return convert.toString(value);

  case 'number':
    return convert.toNumber(value, null);

  case 'boolean':
    return convert.toBoolean(value, null);

  case 'date':
    var format = _.isString(options) ? options : undefined;
    return convert.toDate(value, format);

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
    var format = _.isString(options) ? options : undefined;
    return convert.formatDate(value, format);

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
  def = (def === undefined ? null : def);
  try {
    if (_.isNumber(value)) return value;
    if (!convert.isNumeric(value)) return def;

    var ret = parseInt(value.toString(), 10);
    if (_.isNumber(ret) && !_.isNaN(ret)) return ret;
    return def;

  } catch(e) {
    return def;
  }
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

convert.toBoolean = function(value, def) {
  if (value === null || value === undefined || _.isNaN(value)) value = '';

  var compare     = value.toString().toLowerCase(),
      trueValues  = ['true', '1', '-1', 'yes', 'on', 'si', 'sí'],
      falseValues = ['false', '0', 'no', 'off'];

  if (_.contains(trueValues, compare)) return true;
  if (_.contains(falseValues, compare)) return false;

  return (def === undefined ? null : def);
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

convert.toDate = function(stringDate, format) {
  if (!stringDate) return null;
  if (_.isDate(stringDate)) return stringDate;

  format = format || convert.defaultDateFormat;

  var momentDate = moment(stringDate, format);
  if (!momentDate || !momentDate.isValid()) return null;

  // only two digits for year
  var year = momentDate.year();
  if (year < 100) momentDate.year((year < 69 ? 2000 : 1900) + year);

  var parsedDate = momentDate.toDate();
  if (!parsedDate) return null;

  return parsedDate;
};

convert.formatDate = function(rawDate, format) {
  if (!rawDate) return '';

  format = format || convert.defaultDateFormat;

  var momentDate = moment(rawDate);
  if (!momentDate || !momentDate.isValid()) return '';

  return momentDate.format(format);
};

convert.isDate = function(stringDate, format) {
  return (convert.toDate(stringDate, format) !== null);
};

// escapa los caracteres especiales de expresiones regulares
convert.escapeRegExp = function(value) {
  return value.replace(convert.ESC_REG_EX, "\\$&");
};

  return convert;
});
