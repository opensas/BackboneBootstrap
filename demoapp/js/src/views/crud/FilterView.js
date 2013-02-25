/*globals define,app*/

define( [
    'jquery', 'lodash', 'src/views/BaseView',
    'text!./filter.html'
  ], function(
    $, _, BaseView,
    filterTemplate
  ) {

'use strict';

var FilterView = BaseView.extend({

  initialize: function(options) {
    options = options || {};

    _.defaults(this, options);
    BaseView.prototype.initialize.call(this, options);

    this.template = this.compileTemplate(this.template || filterTemplate);

    this.collection.on('reset', this.update, this);
    this.collection.on('change', this.update, this);
  },

  render: function() {
    this.$el.html(this.template());
    return this;
  },

  events: {
    'keyup .filter_text':   'filter_debounced',
    'click div.filter':     'filter'
  },

  filter: function() {
    this.controller.filter(this.$(".filter_text").val());
  },

  filter_debounced: _.debounce(function() {
    this.filter();
  }, 500),

  update: function() {
    this.$('.filter_text').val(this.controller.queryParams.filter || '');
  }

});

  return FilterView;
});
