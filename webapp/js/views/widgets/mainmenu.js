/*globals $,_,Backbone,utils,src:true*/

'use strict';
var src = src || {};
src.views = src.views || {};
src.views.widgets = src.views.widgets || {};

src.views.widgets.MainMenuView = Backbone.View.extend({

  render: function() {
    this.$el.html(this.template());
    return this;
  },

  template: _.template($('#main-menu-template').html())

});