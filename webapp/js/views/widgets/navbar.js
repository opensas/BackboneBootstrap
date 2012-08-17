/*globals $,_,Backbone,utils,src:true*/

'use strict';
var src = src || {};
src.views = src.views || {};
src.views.widgets = src.views.widgets || {};

src.views.widgets.NavBarView = Backbone.View.extend({

  render: function() {
    this.$el.html(this.template());
    return this;
  },

  template: _.template(' \
<div class="navbar"> \
  <div class="navbar-inner"> \
    <div class="container"> \
      <a class="brand" href="#">Backbone tutorial</a> \
      <div class="nav-collapse"> \
        <ul class="nav"> \
          <li class="active"><a href="#">Home</a></li> \
          <li><a href="#">Link</a></li> \
        </ul> \
        <ul class="nav pull-right"> \
          <li><a href="#">Link</a></li> \
        </ul> \
      </div><!-- /.nav-collapse --> \
    </div> \
  </div><!-- /navbar-inner --> \
</div> \
  ')

});