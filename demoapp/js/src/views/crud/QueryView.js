/*globals define,app,console*/

define( [
    'lodash', 'src/views/crud/ModelView',
    'text!./query.html'
  ], function(
    _, ModelView,
    queryTemplate
  ) {

'use strict';

/**
 * QueryView renders a list of controls bound to a model's field list, in order
 * to enter filter criteria.
 *
 * When entering criteria no validations are applied, and every field is
 * treated as a text field.
 *
 * It takes a collection as parameter. By default it will instantiate a new
 * model of that collection and bind it to the view.
 *
 * When te user clicks on query, it will call the controller's list method
 * passing the attributes of the controls as parameter.
 *
 * @class QueryView
 * @extends ModelView
 */
var QueryView = ModelView.extend({

  /**
   * @property {BaseCollection} collection The collection from which to use as source for the controls.
   */
  collection: undefined,

  initialize: function(options) {
    options = options || {};

    _.defaults(this, options);

    _.bindAll(this, 'query');

    if (!this.collection) throw new Error('Collection not specified!');

    // by default, use the queryFields from the collection
    this.fields = this.fields || this.collection.queryFields || undefined;

    // by default, instantiate a new model of the collection
    this.model = this.model || new this.collection.model();

    // set the template container
    this.containerTemplate = this.containerTemplate || queryTemplate;

    ModelView.prototype.initialize.call(this, options);

  },

  /**
   * Set the fields collection for this view, preparing the fields to be used
   * to enter filter criteria.
   *
   * Basically it takes every field, removing every validation and setting it's
   * type to string.
   *
   * @param {Array<src.Field>\Array<Object>|FieldCollection} fields
   *              Fields to use for this view.
   *
   * @override
   * @chainable
   */
  setFields: function(fields) {

    // remove every validation
    // when filtering we won't apply any validation
    _.each(fields, function(field) {
      field.validations = [];

      // don't validate by field type, the user can type anything when filtering
      field.type = 'string';
    });

    this.model.set(this.fields.defaults());

    // super.setFields
    ModelView.prototype.setFields.call(this, fields);

  },

  events: {
    'click #query-button': 'query'
  },

  /**
   * Applies the filter entered by the user. It calls the controller's list
   * action passing the data entered by the user as query(q) parameter.
   *
   * @chainable
   */
  query: function() {
    this.controller.list({ q: this.model.attributes });
  }

});

  return QueryView;
});
