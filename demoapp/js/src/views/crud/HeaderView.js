/*globals define,app,console*/

define( [
    'lodash', 'src/views/crud/ModelView',
    'text!./header.html'
  ], function(
    _, ModelView,
    headerTemplate
  ) {

'use strict';

/**
 * HeaderView renders the master fields of a master detail Controller. It's a
 * read'only panel, so all fields specified are rendered using non editable
 * controls.
 *
 * @class HeaderView
 * @extends ModelView
 */
var HeaderView = ModelView.extend({

  /**
   * @property {BaseModel} model The parent model to use as source for the
   *                             controls.
   */
  model: undefined,

  initialize: function(options) {
    options = options || {};

    _.defaults(this, options);

    this.title = this.title || '';

    // set the template container
    this.containerTemplate = this.containerTemplate || headerTemplate;

    ModelView.prototype.initialize.call(this, options);

  },

  /**
   * Bind the specified model to the fields and controls collection.
   *
   * It just calls super.setModel, adding a _title property taken from the
   * model's label.
   *
   * @param {BaseModel} model Model to set as the datasource for controls.
   *
   * @override
   * @chainable
   */
  setModel: function(model) {

    // use the fields from model.headerFields if not specified
    if (model && !this.fields) this.fields = model.headerFields;

    // super.setModel
    ModelView.prototype.setModel.call(this, model);

    this.title = this.title || (this.model ? this.model.label : '');

    return this;
  },

  /**
   * Set the controls collection to use for this view.
   *
   * After calling suepr.setControls it set the editable property of each
   * control to false.
   *
   * @param {Array<src.BaseControl|string>} controls
   *              Controls to use for this view.
   *
   * @override
   * @chainable
   */
  setControls: function(controls) {
    ModelView.prototype.setControls.call(this, controls);

    if (this.controls) {
      _.each(this.controls, function(control) {
        control.editable = false;
      });
    }
    return this;
  },

  /**
   * Renders the form view.
   *
   * It calls super.render and also passes the _title property.
   *
   * @override
   * @chainable
   */
  render: function() {
    //super.render, passing the title as aditional data
    return ModelView.prototype.render.call(this, { _title: this.title });
  }

});

  return HeaderView;
});
