/*globals define,app*/

define(
  [
    'jquery', 'lodash', 'backbone',
    'text!src/views/crud/table.html',
    'src/views/crud/pageLen', 'src/views/crud/pages', 'src/views/crud/filter',
    'src/utils/crud'
  ],
  function( $, _, Backbone,
    tableTemplate,
    PageLenView, PagesView, FilterView,
    crud ) {

'use strict';

var TableView = Backbone.View.extend({

  template: _.template(tableTemplate),

  titlesHtml: undefined,      // it's not a template, it's the textual html of the titles

  initialize: function(options) {
    options = options || {};

    // initialize titlesHtml
    this.titlesHtml = 
      options.titlesHtml ||
      crud.generateTableTitlesHtml(this.collection.tableFields);

  },

  render: function() {
    this.$el.html(this.template());

    this.$('#messages-view').html($('#messages-template').html());

    this.$('#headers-view table thead tr').html(this.titlesHtml);

    new PageLenView({
       el: this.$('#page-len-view'), collection: this.collection
    }).render();

    new PagesView({
      el: this.$('#pages-view'), collection: this.collection
    }).render();

    new FilterView({
      el: this.$('#filter-view'), collection: this.collection
    }).render();

    return this;
  },

  events: {
    'click th[order]':    'order'
  },

  order: function(e) {
    var th = $(e.target);
    if (th[0].tagName!=='TH') {th=th.parent();} // click on the i, look for the parent th

    var order = th.attr('order');
    var direction = 'asc';
    if (th.hasClass('order-asc')) {direction = 'desc';}

    $('th[order]').each(function() {
      $(this).removeClass('order-asc');
      $(this).removeClass('order-desc');
    });

    th.addClass(direction === 'asc' ? 'order-asc' : 'order-desc');
    app.navigateWith({order: order +' '+direction}, {trigger: true});
  }

});

  return TableView;
});