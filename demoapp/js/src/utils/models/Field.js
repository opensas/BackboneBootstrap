/*globals define*/

define( [
    'lodash', 'backbone', 'src/BaseObject',
    'src/utils/models/validationHelper',
    'src/utils/convert',
    'src/controls/controlsHelper'
  ], function(
    _, Backbone, BaseObject,
    validationHelper,
    convert,
    controlsHelper
  ){

'use strict';

var Field = BaseObject.extend({

  supportedTypes: ['number', 'string', 'date', 'boolean', 'object'],

  initialize: function(options) {

    options = options || {};

    _.defaults(this, options);

    // when I complete the Model prototype I have no model instantiated
    // if (!this.model) throw new Error('field.model not specified!');

    // the name of the field must correspond to the property in model.attributes
    if (!this.name) throw new Error('field.name not specified!');

    // automatically assign a default value according to the field type
    if (this.defaults === undefined) {
      this.defaults = this._setDefaults(this.type);
    }

    // in the case of a new entity, model.attributes might be empty!
    // if (!_.has(this.model.attributes, this.name)) {
    //   throw new Error('field "' + this.name + '" not found in model.attributes!');
    // }

    // check the field type
    if (!this.type) throw new Error('field.type not specified!');
    this.type = this.type.toLowerCase();

    // added types should register themselves with this._addSupportedTypes
    if (!_.contains(this.supportedTypes, this.type)) {
      throw new TypeError(
        'field.type "' + this.type + '" not supported. ' +
        'Supported types: ' + this.supportedTypes.join(', ')
      );
    }

    // used for column headers and form labels
    this.label = this.label || this.name;

    // contextual help to display in forms
    this.help = this.help || '';

    this.editable = (this.editable === undefined ? true : this.editable);
    if (!_.isBoolean(this.editable)) throw new TypeError('field.editable should be a boolean value!');

    this.order = (this.order === undefined ? this.name : this.order);

    this.validations = this.validations || [];
    this.errors = this.errors || [];
    this.error = !this.isValid();

    this.formatter = this.formatter || {};
    if (!_.isObject(this.formatter)) throw new TypeError('field.formatter should be an object!');

    this.formatter.fromRaw = this.formatter.fromRaw || this._fromRaw;
    if (!_.isFunction(this.formatter.fromRaw)) throw new Error('field.formatter.fromRaw should be a function!');
    this.formatter.fromRaw = _.bind(this.formatter.fromRaw, this);

    this.formatter.toRaw = this.formatter.toRaw || this._toRaw;
    if (!_.isFunction(this.formatter.toRaw)) throw new Error('field.formatter.toRaw should be a function!');
    this.formatter.toRaw = _.bind(this.formatter.toRaw, this);

    this.fullName = this.fullName || this.name;
    this.displayTemplate = this.displayTemplate || this.name;

    // default control type, if not specified use an input
    var controlOptions = this.control ? this.control : 'input';

    // create an instance of the control type, and bind it to this field
    this.control = controlsHelper.createControl(controlOptions, { field: this });

  },

  /**
   * Default toRaw formatter.
   *
   * Takes a string formatted representation of a basic type
   * and returns the value converted to this.type
   *
   * The raw value of a field is the way in which is is saved or
   * retrieved from model.attributes.
   *
   * To be overwritten by objects extending Field.
   *
   * Supported types: string, number, boolean, date
   *
   * Object type is not supported, in that case will raise an exception.
   * You should use an ObjectField to handle object types.
   *
   * @param  {string}     formattedValue the string representation of the formatted value
   * @return {string|number|boolean|date|null}  the value converted to this.type
   */
  _toRaw: function(formattedValue) {
    // only handles basic types
    // will throw an error if an error is passed
    // it shoulb be handled by an ObjectField
    return convert.convert(formattedValue, this.type);
  },

  /**
   * Default fromRaw formatter.
   *
   * Takes a value of type string|number|date|boolean
   * and returns it's string representation formatted
   * to display it in a control value attribute
   *
   * To be overwritten by objects extending Field.
   *
   * Supported types: string, number, boolean, date
   *
   * You should use an ObjectField to handle object types.
   *
   * @param  {string|number|boolean|date}  rawValue   the raw value of the field
   * @return {string}    the value formatted to be used in a "value" tag
   *                     of an html control
   */
  _fromRaw: function(rawValue) {
    //#TODO - format string!
    return convert.format(rawValue);
  },

  /**
   * Get the current raw value of the field
   * or set the raw value if value is passed.
   *
   * If value is passed, the underlying model is updated
   * using this.model.set(this.name, value).
   *
   * It returns the value of the underlying model attribute using model.get.
   *
   * @param  {undefined|string|number|date|boolean} rawValue [description]
   * @param  {Object} options
   * @param  {boolean} options.validate   True if the model should validate the
   *                                      field with model.validateField
   * @return {string|number|date|boolean}       The new value of the field
   */
  val: function(rawValue, options) {
    if (!this.model) throw new Error('field model not set!');

    if (rawValue !== undefined) {
      this.model.set(this.name, rawValue);
      options = _.defaults(options || {}, { validate: true });
      // call model.validateField method to update the model's error collection
      if (options.validate) this.model.validateField(this);
    }
    return this.model.get(this.name);
  },

  /**
   * Get the current formatted value of the field
   * or set the formatted value if value is passed.
   *
   * If value is passed, the formatted value is translated to it's raw format
   * and the underlying model is updated using this.val()
   *
   * It returns the current formatted value of the field
   *
   * @param  {string} formattedValue  the formattedValue to save to the field
   * @param  {Object} options
   * @param  {boolean} options.validate   True if the model should validate the
   *                                      field with model.validateField
   * @return {string}                 the current formatted value of the field
   */
  formattedVal: function(formattedValue, options) {
    if (formattedValue !== undefined) {
      this.val(this.formatter.toRaw(formattedValue), options);
    }
    return this.formatter.fromRaw(this.val());
  },

  /**
   * Applies everyt validation of the field
   * and populares the errors array.
   *
   * @return {string}                 the current formatted value of the field
   *
   * @return {Array.<{field: string, message: string}>}  the errors array.
   *
   * This method clears the error array, the it evaluates every validation
   * defined for the field, passing the current value and a reference to
   * the field itself.
   *
   * Triggers `validate` event when done. Controls should bind to this event
   * in order to display the errors for this field on screen.
   */
  validate: function() {

    // clear errors collection, check http://stackoverflow.com/questions/1232040/how-to-empty-an-array-in-javascript
    this.errors.length = 0;

    _.each(this.validations, function(validation) {
      var result;

      // add a reference to the field being tested;
      validation.field = this;
      validation.value = this.val();
      result = validationHelper.validate(validation);

      if (_.isObject(result)) this.errors.push(result);
    }, this);

    this.trigger('validate', this.errors);

    this.error = !this.isValid();
    return this.errors;
  },

  setServerErrors: function(serverErrors) {

    // clear errors collection, check http://stackoverflow.com/questions/1232040/how-to-empty-an-array-in-javascript
    this.errors.length = 0;

    serverErrors = serverErrors || [];

    // return an array with the errors related with this field
    this.errors = _.filter(serverErrors, function(serverError) {
      return serverError.field === this.name;
    }, this);

    this.trigger('validate', this.errors);

    this.error = !this.isValid();
    return this.errors;
  },

  /**
   * Return true if there are no errors in the errors array
   *
   * @return {Boolean} True if errors array is empty.
   */
  isValid: function() {
    return this.errors.length === 0;
  },

  /**
   * Sets a default value according to the field type
   *
   * To be overwritten by object extending Field.
   *
   * @param {string} type One of the following values: string|number|date|boolean
   */
  _setDefaults: function(type) {
    switch (type.toLowerCase()) {
      case 'string':  return '';
      case 'number':  return null;
      case 'date':    return null;
      case 'boolean': return null;
      default:        return null;
    }
  },

  /**
   * Adds a new type to the list of supported field types.
   *
   * To be called by objects extending Field.
   *
   * @chainable
   */
  _addSupportedType: function(type) {
    if (!_.contains(this.supportedTypes, type)) {
      this.supportedTypes.push(type);
    }
    return this;
  }

});

// give the object the ability to bind and trigger custom named events.
_.extend(Field.prototype, Backbone.Events);

  return Field;
});
