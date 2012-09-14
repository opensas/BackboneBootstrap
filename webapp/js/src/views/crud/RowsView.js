/*globals define,app,RowView*/

define(
  ['jquery', 'lodash', 'backbone', 'src/utils/crud', 'src/utils/views'],
  function( $, _, Backbone, crud, views ) {

'use strict';

var RowsView = Backbone.View.extend({

  rowView: undefined,

  initialize: function(options) {
    options = options || {};
    this.collection.bind('reset', this.render, this);
    this.collection.bind('change', this.render, this);

    this.initRowView(options);
  },

  // allow to define another view or template for rendering the rows
  // dynamically generate default template from model's tableFields definition
  // if no template is specified
  initRowView: function(options) {

    this.rowView = options.rowView || this.rowView || RowView;

    var rowTemplate = options.rowTemplate || 
      crud.generateTableRowTemplate(this.collection.tableFields);

    this.rowView.prototype.template = views.compileTemplate(rowTemplate);
  },

  render: function() {
    this.$el.empty();

    _.each(this.collection.models, function (model) {
      var view = new this.rowView({
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
    app.navigateToId(this.model.id, true);
  },

  initialize: function() {
    this.model.bind('destroy', this.remove, this);
    this.model.bind('change', this.render, this);
  },

// to be specified when using it, or automatically generated from collection.tableFields
  template: undefined

});

  return RowsView;
});