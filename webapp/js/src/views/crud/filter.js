/*globals define*/
'use strict';

define(
  ['jquery', 'lodash', 'backbone',
  'text!src/views/crud/filter.html'],
  function( $, _, Backbone, filterTemplate) {

var FilterView = Backbone.View.extend({

  initialize: function() {
    this.collection.bind('reset', this.update, this);
    this.collection.bind('change', this.update, this);
  },

  render: function() {
    this.$el.html(this.template());
    return this;
  },

  events: {
    'keyup #filter_text':   'filter_debounced',
    'click div.filter':     'filter'
  },

  filter: function() {
    app.navigateWith({filter: this.$("#filter_text").val()}, {trigger: true});
  },

  filter_debounced: _.debounce(function() {
    this.filter();
  }, 500),

  update: function() {
    this.$('#filter_text').val(this.collection.filter);
  },

  template: _.template(filterTemplate)

});

  return FilterView
})