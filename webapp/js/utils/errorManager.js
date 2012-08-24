'use strict';
var src = src || {};
src.crud = src.crud || {};

var ErrorManager = src.crud.ErrorManager = function(options) {
  this.initialize(options);
}

_.extend(ErrorManager.prototype, {

  // root element of form
  el: undefined,

  response: undefined,

  // Array of errors
  errors: [],

  // True if there's any error
  hasErrors: false,

  // Array of all fields
  fields: [],

  // Associative array of every field container per field
  fieldContainers: {},

  // Associative array of every error container per field
  errorContainers: {},

  // Array of fields with errors
  errorFields: [],

  // Cached jQueried el
  $el: undefined,

  // shorcut for selecting elements
  $: function(selector) {
    return this.$el.find(selector);
  },

  setElement: function(element) {
    this.$el = $(element);
  },

  errorsByField: function(field) {
    return _.filter(this.errors, function(error) {
      return error.field === field;
    });
  },

  // removes alert messages and errors messages from every field
  clearAll: function() {
    this.clearAlerts();
    this.clearAllFields();
  },

  // removes errors messages from every field
  clearAllFields: function() {
    _.each(this.fields, function(field) {
      this.clearField(field);
    }, this);
  },

  // removes errors messages from a specified field
  clearField: function(field) {
    this.fieldContainers[field].removeClass('error');
    this.errorContainers[field].html('');
  },

  // removes all alert message
  clearAlerts: function() {
    var alerts = this.selectAllAlerts();
    alerts && alerts.removeClass('active');
  },

  selectAllAlerts: function() {
    return this.$('div.alert');
  },

  selectAlert: function(alertType) {
    return this.$('div.alert.alert-' + alertType);
  },

  initialize: function(options) {
    this._configure(options);
    this.loadFields();
    if (this.response) {
      this.setResponse(this.response);
    } else {
      this.setErrors(this.errors);
    }
  },

  setResponse: function(response) {
    this.response = response;
    this.setErrors($.parseJSON(this.response.responseText));
    return this;
  },

  // parses the html form and loads:
  // fields: an array of every field -> every input with and id attribute : this.$(':input[id]')
  // fieldContainers: jQuery dom object pointing at each field container (we will add an error class to them)
  // errorContainers: jQuery dom object pointing at each error ul (we will add li with each error)
  loadFields: function() {
    var field = '';
    this.fields = [];

    _.each(this.$(':input[id]'), function(input) {
      input = $(input);
      field = input.attr('id');
      this.fields.push(input.attr('id'));
      this.fieldContainers[field] = input.parent();
      this.errorContainers[field] = this.fieldContainers[field].find('ul');
    }, this);

  },

  setErrors: function(errors) {
    this.errors = errors;
    // get the fields with errors without duplicates and without the empty elements (errors without field)
    this.errorFields = _.without(_.uniq(_.pluck(this.errors, 'field')),'');
    this.hasErrors = (this.errors.length > 0);
  },

  render: function() {
    var errors = [];
    this.clearAll();

    // alerts
    if (this.hasErrors) {
      var alertContainer = this.selectAlert('error');
      if (alertContainer) {
        alertContainer.find('span.title').text('Se han producido errores al grabar los cambios');
      }
      var alertsContainer = alertContainer.find('ul');
      _.each(this.errorsByField(''), function(error) {
        alertsContainer.append('<li>' + error.message + '</li>');
      }, this);
      alertContainer.addClass('active');
    }

    // for each field with error
    _.each(this.errorFields, function(field) {
      this.fieldContainers[field].addClass('error');

      // for each error for this particular field
      _.each(this.errorsByField(field), function(error) {
        this.errorContainers[field].append('<li>' + error.message + '</li>');
      }, this);
    }, this);

  },

  // Performs the initial configuration of the errorManager
  _configure: function(options) {
    options = options || {};
    for (var prop in options) {
      if (prop==='el') {
        this.setElement(options[prop]);
      } else if (prop==='response') {
        this.setResponse(options[prop]);
      } else {
        this[prop] = options[prop];
      }
    }
  }

});