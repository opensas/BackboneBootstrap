/*globals $,_,Backbone,utils,src:true*/

'use strict';
var src = src || {};
src.views = src.views || {};
src.views.widgets = src.views.widgets || {};

src.views.widgets.BreadCrumbView = Backbone.View.extend({

  render: function() {
    this.$el.html(this.template());
    return this;
  },

  template: _.template(' \
<ul class="breadcrumb"> \
  <li> \
    <a href="#">Home</a> <span class="divider">/</span> \
  </li> \
  <li> \
    <a href="#">Data</a> <span class="divider">/</span> \
  </li> \
  <li class="active">Members</li> \
</ul> \
  ')

});