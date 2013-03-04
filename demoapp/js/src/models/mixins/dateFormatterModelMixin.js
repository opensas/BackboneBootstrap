/*globals define*/

define( [
    'lodash',
    'src/utils/convert',
    'src/utils/mixins/findBy'
  ], function(
    _,
    convert,
    findBy
  ) {

'use strict';

var mixin = {};

mixin.dateFormatterModel = function(model, backendDateFormat) {

  // already mixedin
  if (model.__dateFormatterModel) return;

  model.__dateFormatterModel = true;

  var backendToRaw = model.backendToRaw;
  model.backendToRaw = function(attrs) {
    if (!this.fields) return attrs;

    var converter = function(backendDate) {
      return convert.toDate(backendDate, backendDateFormat);
    };

    var converted = convertDateFields(attrs, this.fields, converter);

    return backendToRaw.call(this, converted);
  };

  var rawToBackend = model.rawToBackend;
  model.rawToBackend = function(attrs) {
    if (!this.fields) return attrs;

    var converter = function(rawDate) {
      return convert.formatDate(rawDate, backendDateFormat);
    };

    var converted = convertDateFields(attrs, this.fields, converter);

    return rawToBackend.call(this, converted);
  };

  var convertDateFields = function(attrs, schema, converter) {
    if (!schema || !converter) return attrs;

    var key, field;

    attrs = _.clone(attrs, true);     // we don't own attrs
    for (key in attrs) {
      field = _.findBy(schema, 'name', key);
      if (field && field.type === 'date') {
        attrs[key] = converter(attrs[key], field);
      }
    }
    return attrs;
  };

};

  return mixin;
});
