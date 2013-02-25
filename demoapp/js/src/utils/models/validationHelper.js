/*globals define*/

define( [
    'lodash',
    'src/utils/string', 'src/utils/convert'
  ], function(
    _,
    string, convert
  ) {

'use strict';

var validationHelper = {};

validationHelper.regex = {
  url: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \?=.-]*)*\/?$/,
  mail: /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/
};

validationHelper.validate = function(options) {

  var validation  = options.method || '',
      method      = 'valid' + string.capitalize(validation);

  if (!validation) throw new TypeError('validation not specified!');

  if (!_.has(validationHelper, method)) {

    var supported = _.filter(_.functions(this), function(method) {
      return string.startsWith(method, 'valid') && method !== 'validate';
    }).join(', ');

    throw new TypeError(
      'validation "' + validation + '" not supported. ' +
      'Supported validations: ' + supported
    );
  }

  return validationHelper[method](options);
};

validationHelper.validRequired = function(options) {
  var value   = options.value,
      message = options.message || 'El campo "{1}" no puede estar vacío.';

  if (string.isEmpty(value) || value === undefined || value === null) {
    return {
      field:    options.field.name,
      message:  string.format(message, options.field.label)
    };
  }

  return true;
};

validationHelper.validFormat = function(options) {

  switch (options.field.type.toLowerCase()) {
  case 'number':
    return validationHelper.numberFormat(options);
  case 'date':
    return validationHelper.dateFormat(options);
  case 'string':
    return validationHelper.stringFormat(options);
  }
  return true;
};

validationHelper.numberFormat = function(options) {
  options.message = options.message || 'El campo "{1}" debe ser un número.';

  if (isNaN(options.value)) {
    return {
      field:    options.field.name,
      message:  string.format(options.message, options.field.label)
    };
  }
  return true;
},

validationHelper.dateFormat = function(options) {
  options.message = options.message || 'El campo "{1}" debe ser una fecha válida.';

  if (!convert.isValidDate(options.value)) {
    return {
      field:    options.field.name,
      message:  string.format(options.message, options.field.label)
    };
  }
  return true;
},

validationHelper.stringFormat = function(options) {
  var pattern = options.pattern,
      type    = options.type.toLowerCase(),
      message = options.message;

  switch (type) {

  case 'mail':
    message = message || 'El campo "{1}" debe contener una dirección de correo válida.';
    pattern = validationHelper.regex.mail;
    break;

  case 'url':
    message = message || 'El campo "{1}" debe contener una dirección url válida.';
    pattern = validationHelper.regex.url;
    break;

  default:
    if (!pattern) throw new Error('No pattern or format type specified.');
    message = message || 'El campo "{1}" tiene un formato erróneo.';
  }

  if (!pattern.test(options.value)) {
    return {
      field:    options.field.name,
      message:  string.format(message, options.field.label)
    };
  }

  return true;
};

validationHelper.validLength = function(options) {
  var field   = options.field,
      len     = (options.value || '').toString().length,
      min     = options.min || field.min || undefined,
      max     = options.max || field.max || undefined,
      message = options.message;

  if (min && len < min) {
    message = message || 'El campo "{1}" debe tener al menos {2} caracteres.';
    return {
      field: field.name,
      message: string.format(message, field.label, min)
    };
  }
  if (max && len > max) {
    message = message || 'El campo "{1}" no puede tener más de {2} caracteres.';
    return {
      field: field.name,
      message: string.format(message, field.label, max)
    };
  }

  return true;
};

validationHelper.validRange = function(options) {

  switch (options.field.type.toLowerCase()) {
  case 'number':
    return validationHelper.numberRange(options);
  case 'date':
    return validationHelper.dateRange(options);
  case 'string':
    return validationHelper.stringRange(options);
  }
  return true;
};

validationHelper.numberInRange = function(options) {
  var value   = parseFloat(options.value),
      message = options.message,
      limit;

  // empty or invalid number
  if (value === undefined || value === null) return true;

  if (options.lessEqual && value > options.lessEqual) {
    message = message || 'El campo "{1}" debe ser menor o igual a {2}.';
    limit = options.lessEqual;
  }

  if (options.less && value >= options.less) {
    message = message || 'El campo "{1}" debe ser menor a {2}.';
    limit = options.less;
  }

  if (options.greatEqual && value < options.greatEqual) {
    message = message || 'El campo "{1}" debe ser mayor o igual a {2}.';
    limit = options.greatEqual;
  }

  if (options.greater && value <= options.greater) {
    message = message || 'El campo "{1}" debe ser mayor a {2}.';
    limit = options.greater;
  }

  if (limit) {
    return {
      field: options.field.name,
      message: string.format(message, options.field.label, limit)
    };
  }

  return true;
};

validationHelper.dateInRange = function(options) {
  var value   = convert.toDate(options.value),
      message = options.message,
      limit;

  // empty date
  if (!value) return true;

  if (options.lessEqual && value > convert.toDate(options.lessEqual)) {
    message = message || 'El campo "{1}" debe ser menor o igual a {2}.';
    limit = options.lessEqual;
  }

  if (options.less && value >= convert.toDate(options.less)) {
    message = message || 'El campo "{1}" debe ser menor a {2}.';
    limit = options.less;
  }

  if (options.greatEqual && value < convert.toDate(options.greatEqual)) {
    message = message || 'El campo "{1}" debe ser mayor o igual a {2}.';
    limit = options.greatEqual;
  }

  if (options.greater && value <= convert.toDate(options.greater)) {
    message = message || 'El campo "{1}" debe ser mayor a {2}.';
    limit = options.greater;
  }

  if (limit) {
    return {
      field: options.field.name,
      message: string.format(message, options.field.label, limit)
    };
  }

  return true;
};

  return validationHelper;
});