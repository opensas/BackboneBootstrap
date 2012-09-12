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
    'click div.filter':     'filter',

    'keypress #query_text':    'query'
  },

  filter: function() {
    app.navigateWith({filter: this.$("#filter_text").val()}, {trigger: true});
  },

  filter_debounced: _.debounce(function() {
    this.filter();
  }, 500),

  query: function(e) {
    if (e.keyCode === 13) {
      app.navigateWith({q: this.$("#query_text").val()}, {trigger: true});
    }
  },

  query_debounced: _.debounce(function() {
    this.query();
  }, 500),

  update: function() {
    this.$('#filter_text').val(this.collection.filter);
    this.$('#query_text').val(this.collection.query);
  },

  template: _.template(filterTemplate)

});

  return FilterView
})