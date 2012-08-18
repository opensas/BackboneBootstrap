/*globals $,_,Backbone,utils,src:true*/

'use strict';
var src = src || {};
src.views = src.views || {};
src.views.crud = src.views.crud || {};

src.views.crud.TableView = Backbone.View.extend({

  template: _.template($('#table-template').html()),

  render: function() {
    this.$el.html(this.template());

    this.$('#messages').html($('#messages-template').html());

    new src.views.crud.PageLenView({
       el: this.$('#page-len'), collection: this.collection
    }).render();

    new src.views.crud.PagesView({
      el: this.$('#pages'), collection: this.collection
    }).render();

    new src.views.crud.FilterView({
      el: this.$('#filter-box'), collection: this.collection
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
    app.navigateWith({order: order+' '+direction}, {trigger: true});
  }

});