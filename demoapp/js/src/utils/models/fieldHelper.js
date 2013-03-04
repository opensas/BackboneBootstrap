/*globals define*/

//TODO: used???
define( [
    'lodash',
    'src/utils/models/Field',
    'src/utils/models/ObjectField',
    'src/utils/models/DateField'
  ], function(
    _,
    Field,
    ObjectField,
    DateField
  ) {

'use strict';

var fieldHelper = {};

fieldHelper.createField = function(options) {
  var type,
      FieldConstructor;

  options = options || {};

  // TODO- raise an Error! we should always receive a plain object!
  // received and already instantiared field, just return it
  if (options instanceof Field) return options;

  type = (options.type || 'string').toLowerCase();

  // the control instance has already been created
  if (!_.isString(type)) throw new Error('control.type should be a string.');

  if (type === 'object') {
    FieldConstructor = ObjectField;
  } else if (type === 'date') {
    FieldConstructor = DateField;
  } else {
    FieldConstructor = Field;
  }

  return new FieldConstructor(options);

};

fieldHelper.createFields = function(fields) {
  return _.map(fields, function(field) {
    return fieldHelper.createField(field);
  });
};

  return fieldHelper;
});
