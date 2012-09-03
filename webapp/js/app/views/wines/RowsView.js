/*globals define*/

define(
  ['jquery', 'lodash', 'backbone', 'src/utils/crud'],
  function( $, _, Backbone, crud) {

'use strict';
var RowsView = Backbone.View.extend({

  template: _.template($('#table-template').html()),

  initialize: function() {
    this.collection.bind('reset', this.render, this);
    this.collection.bind('change', this.render, this);
  },

  render: function() {
    this.$el.empty();

    _.each(this.collection.models, function (model) {
      var view = new RowView({
        model: model, collection: this.collection
      });
      this.$el.append(view.render().el);
    }, this);

    if (this.collection.filter) {
      crud.highlightItems(this.$('td'), this.collection.filter);
    }

    return this;
  }

});

var RowView = Backbone.View.extend({
  tagName: 'tr',

  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  },

  events: {
    'click':  'edit'
  },

  edit: function() {
    window.app.navigate('wines/' + this.model.id, true);
  },

  initialize: function() {
    this.model.bind('destroy', this.remove, this);
    this.model.bind('change', this.render, this);
  },

  template: _.template( ' \
      <td><%= id %></td> \
      <td><%= name %></td> \
      <td><%= grapes %></td> \
      <td><%= country %></td> \
      <td><%= region %></td> \
      <td><%= year %></td> \
    ')

});

  return RowsView;
});