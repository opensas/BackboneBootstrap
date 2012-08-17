/*globals $,_,Backbone,utils,src:true*/

'use strict';
var src = src || {};
src.views = src.views || {};
src.views.crud = src.views.crud || {};

src.views.crud.FilterView = Backbone.View.extend({

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

  template: _.template(' \
    <input type="text" id="filter_text"> \
    <div class="btn btn-info btn-small filter" id="filter"> \
      <i class="icon-search icon-white"></i>filter</div> \
  ')

});