/*globals define*/
'use strict';

define( [
  'jquery', 'lodash', 'backbone', 
  'text!src/views/wine/form.html', 'src/utils/errorManager'],
  function( $, _, Backbone, 
    formTemplate, ErrorManager) {

var FormView = Backbone.View.extend({

  initialize: function() {
    _.bindAll(this, 'save', 'success', 'error', 'cancel', 'close');
    this.previous = this.model.toJSON();
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
    var attrs = {
      name: this.$('#name').val(),
      grapes: this.$('#grapes').val(),
      country: this.$('#country').val(),
      region: this.$('#region').val(),
      description: this.$('#description').val(),
      year: this.$('#year').val()
    };

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
    app.navigate('wines', options);
  },

  template: _.template(formTemplate),

});

  return FormView;
});