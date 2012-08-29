/*globals define*/
'use strict';

define(
  ['jquery', 'lodash', 'backbone'],
  function( $, _, Backbone) {

var MainMenuView = Backbone.View.extend({

  render: function() {
    this.$el.html(this.template());
    return this;
  },

  template: _.template($('#main-menu-template').html())

});

  return MainMenuView;
});