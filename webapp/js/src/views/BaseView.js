/*globals define,app,console*/

define( [
    'jquery', 'lodash', 'backbone'
  ], function(
    $, _, Backbone
  ) {

'use strict';

var BaseView = Backbone.View.extend({

  views: [],

  destroy: function() {
    this.destroyViews()
    this.undelegateEvents()
    this.remove()
    this.off()      // formerly known as unbind
  },

  destroyViews: function() {
    //- call destroy method for each view
    _.invoke(this.views, 'destroy');
    delete this.views; // or this.views = null
    this.views = [];
  }

});

  return BaseView;
});