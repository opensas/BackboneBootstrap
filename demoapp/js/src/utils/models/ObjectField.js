/*globals define*/

define( [
    'lodash',
    'src/utils/models/Field',
    'src/utils/convert'
  ], function(
    _,
    Field,
    convert
  ){

'use strict';

/**
   A field that can handle nested objects.

   @class ObjectField
   @extend Field
   @constructor
*/
var ObjectField = Field.extend({

  initialize: function(options) {

    options = options || {};

    _.defaults(this, options);

    this._addSupportedType('object');

    this.type = this.type || 'object';

    // idField of the nested object
    // by default, it's just the name of the field plus 'Id'
    // example: field.name: 'customer', field.idAttribute: 'customerId'
    if (!this.idAttribute) this.idAttribute = this.name + 'Id';

    // field to display to the user
    // if not specified just take the idAttribute
    // example: field.name: 'customer', field.idAttribute: 'name' (the name of the customer)
    if (!this.displayAttribute) this.displayAttribute = this.idAttribute;

    // fully qualified name of the nested field
    // example: customer.customerId
    this.fullName = this.fullName || this.name + '.' + this.idAttribute;

    // fully qualified expression to display to the user
    // example: customer.name
    this.displayTemplate = this.displayTemplate || this.name + '.' + this.displayAttribute;

    // if order is not specified, order by the display expression
    if (this.order === undefined) this.order = this.displayTemplate;

    Field.prototype.initialize.call(this, options);

  },

  /**
   * Adds the default vlaue (null) for nested object
   *
   * @param {string} type   Should be equal to object,
   *                        otherwise it will be handled by super._setDefaults
   *
   * @override
   *
   */
  _setDefaults: function(type) {

    if (type.toLowerCase() === 'object') return null;

    // super.setDefaults
    return Field.prototype.setDefaults.call(this, type);
  },

  //#TODO - #used???
  idVal: function(idValue) {
    var object = this.val();

    // update the value with idValue
    if (idValue !== undefined) {
      if (!_.isObject(object)) object = {};
      object[this.idAttribute] = idValue;
      this.val(object);
      object = this.val();
    }

    // read the current value of id
    if (object) {
      return object[this.idAttribute];
    } else {
      return null;
    }
  },

  /**
   * Overrides Field._fromRaw to handle nested object values
   *
   * In it's raw format the field holds a nested object
   * and _fromRaw returns the id of the object.
   *
   * @param  {Object}   rawValue  Field's nested object
   * @return {string}             The id of the nested object as a string
   *
   * @override
   *
   * @example
   * var rawValue = {
   *   invoiceId: 4,
   *   customer: {
   *     customerId: 56,
   *     name: 'John Palmer'
   *   },
   *   amount: 15.5
   * }
   * field.idAttribute = 'customerId';
   * this._fromRaw(rawValue) // -> 56
   *
   * In this case the customer field is a nested object.
   *
   * It is represented by an instance of ObjectField of type 'object'
   *
   */
  _fromRaw: function(rawValue) {
    if (rawValue === undefined || rawValue === null) return '';

    var formatted = rawValue[this.idAttribute];
    if (formatted === undefined) return '';

    return formatted.toString();
  },

  /**
   * Overrides Field._toRaw to handle nested object values
   *
   * It receives a nested object id as a string
   * and returns a nested object with that id,
   * using field.idAttribute to hold the id value.
   *
   * @param  {string}  formattedValue  The id of the nested object as a string
   * @return {Object}
   *
   * @override
   *
   * @example
   * var rawValue = {
   *   invoiceId: 4,
   *   customer: {
   *     customerId: 56,
   *     name: 'John Palmer'
   *   },
   *   amount: 15.5
   * }
   * field.idAttribute = 'customerId';
   * this._fromRaw(rawValue) // -> 56
   *
   * In this case the customer field is a nested object.
   *
   * It is represented by an instance of ObjectField of type 'object'
   *
   */
  _toRaw: function(formattedValue) {
    if (!formattedValue || !convert.isNumeric(formattedValue)) return null;
    var raw = {};
    raw[this.idAttribute] = convert.toNumber(formattedValue);
    return raw;
  }

});

  return ObjectField;
});
