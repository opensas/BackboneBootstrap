/*globals define,app,console*/

define( [
    'jquery', 'lodash', 'backbone',
    'text!src/views/crud/form.html',
    'src/utils/errorManager', 'src/utils/crud', 'src/utils/views'
  ], function(
    $, _, Backbone,
    formTemplate, ErrorManager, crud, views
  ) {

'use strict';

var FormView = Backbone.View.extend({

  initialize: function(options) {
    options = options || {};
    _.bindAll(this, 'save', 'success', 'error', 'cancel', 'close');

    this.setModel(this.model);

    if (options.template) { this.template = views.compileTemplate(options.template); }
  },

  setModel: function(model) {
    this.model = model;
    if (this.model) { this.previous = this.model.toJSON(); }
  },

  // check that we have a valid function template
  _ensureTemplate: function() {
    var template = this.template;
    if (_.isFunction(template)) { return; }

    if (!template) { template = this.getDefaultTemplate(); }

    this.template = views.compileTemplate(template);
  },

  // automatically generate a default template from the data in this.model.formFields
  getDefaultTemplate: function() {
    var controlsTemplate = crud.generateFormTemplate(this.model.formFields);
    var template = formTemplate.replace('%controls%', controlsTemplate);
    return template;
  },

  render: function() {
    this._ensureTemplate();
    this.$el.html(this.template(this.model.toJSON()));
    this.$el.show();
    $('#table-view').hide();
    return this;
  },

  // used to revert changes in the model when the user cancels the edition
  previous: undefined,

  errorManager: undefined,

  template: undefined,

  events: {
    'click div.save'   : 'save',
    'click div.cancel' : 'cancel'
  },

  save: function() {

    var attrs = crud.getAttrs(this.model.defaults, this.$el);

    crud.saveModel(
      attrs, this.model, this.collection,
      this.success, this.error
    );

  },

  success: function() {
    // toastMessage.removeProcess();
    this.close(true);
  },

  error: function(model, resp) {
    // toastMessage.removeProcess();
    this.errorManager = new ErrorManager({
      el: this.$el,
      response: resp
    }).render();
  },

  cancel: function() {
    this.model.set(this.previous);
    this.close({
      trigger: false
    });
  },

  close: function(options) {
    $('#table-view').show();
    this.$el.hide();
    app.navigateToList(options);
  }

});

  return FormView;
});