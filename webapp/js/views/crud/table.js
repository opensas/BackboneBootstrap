/*globals $,_,Backbone,utils,src:true*/

'use strict';
if (!src) {src = {};}
if (!src.views) {src.views = {};}
if (!src.views.crud) {src.views.crud = {};}

src.views.crud.TableView = Backbone.View.extend({

  template: _.template($('#wines-template').html()),

  render: function() {
    this.$el.html(this.template());

    new src.views.crud.PageLenView({
       el: this.$('#winePageLen'), collection: this.collection
    }).render();

    new src.views.crud.PagesView({
      el: this.$('#winePagination'), collection: this.collection
    }).render();

    new src.views.crud.FilterView({
      el: this.$('#wineFilter'), collection: this.collection
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