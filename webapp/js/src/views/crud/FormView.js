/*globals define,app,console*/

define( [
  'jquery', 'lodash', 'backbone', 
  'text!src/views/crud/form.html', 
  'src/utils/errorManager', 'src/utils/crud', 'src/utils/views'],
  function( $, _, Backbone, 
    formTemplate, ErrorManager, crud, views ) {

'use strict';

var FormView = Backbone.View.extend({

  initialize: function(options) {
    options = options || {};
    _.bindAll(this, 'save', 'success', 'error', 'cancel', 'close');
    this.previous = this.model.toJSON();

    this.initTemplate(options);
  },

  initTemplate: function(options) {

    var template;

    if (options.template) {
      template = options.template;
    } else {
      template = formTemplate.replace(
        '%controls%', crud.generateFormTemplate(this.model.formFields)
      );
    }

    this.template = views.compileTemplate(template);
  },

  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    this.$el.show();
    $('#table-view').hide();
    return this;
  },

  previous: {},

  errorManager: undefined,

  events: {
    'click div.save': 'save',
    'click div.cancel': 'cancel'
  },

  save: function() {

    var attrs = crud.getAttrs(this.model.defaults, this.$el);

    if (this.model.isNew()) {
      this.collection.create(attrs, {
        success: this.success,
        error: this.error
      });
    } else {
      this.model.save(attrs, {
        success: this.success,
        error: this.error
      });
    }
  },
  
  success: function() {
    console.log(arguments);
    this.close(true);
  },

  error: function(model, resp) {
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
    this.$el.unbind();
    this.$el.empty();
    app.navigateToList(options);
  },

  template: _.template(formTemplate)

});

  return FormView;
});