/*globals define,app,RowView*/

define( [
    'lodash',
    'src/views/BaseView', 'src/utils/crud'
  ], function(
    _,
    BaseView, crud
  ) {

'use strict';

var RowsView = BaseView.extend({

  rowView: undefined,

  rowTemplate: undefined,

  initialize: function(options) {
    options = options || {};

    _.extend(this, options);

    BaseView.prototype.initialize.call(this, options);

    if (!this.collection) throw new Error('collection not specified!');

    this.collection.on('reset', this.render, this);
    this.collection.on('change', this.render, this);

    this.tableFields = this.tableFields || this.collection.tableFields;

    this.initRowView(options);
  },

  // allow to define another view or template for rendering the rows
  // dynamically generate default template from model's tableFields definition
  // if no template is specified
  initRowView: function(options) {

    this.RowView = options.rowView || this.RowView || RowView;

    var rowTemplate = options.rowTemplate ||
      crud.generateTableRowTemplate(this.tableFields);

    this.rowTemplate = this.compileTemplate(rowTemplate);
  },

  render: function() {
    this.$el.empty();
    this.destroyViews();

    _.each(this.collection.models, function (model) {
      var view = new this.RowView({
        model      : model,
        collection : this.collection,
        controller : this.controller,
        template   : this.rowTemplate
      });
      this.$el.append(view.render().el);
      this.views.push(view);
    }, this);

    if (this.collection.filter) {
      crud.highlightItems(this.$('td'), this.collection.filter);
    }

    if (this.collection.length === 0) {
      if (this.collection.filter) {
        this.controller.warning('No se encontraron registros coincidentes con los criterios de búsqueda.');
      } else {
        this.controller.warning('No se encontraron registros.');
      }
    }

    return this;
  }

});

var RowView = BaseView.extend({
  tagName: 'tr',

  // to be specified when using it, or automatically generated from collection.tableFields
  template: undefined,

  initialize: function(options) {
    options = options || {};
    BaseView.prototype.initialize.call(this, options);

    this.template = options.template || undefined;
    if (!this.template) throw new Error('no template defined.');

    this.model.bind('destroy', this.remove, this);
    this.model.bind('change', this.render, this);
  },

  render: function() {
    this.$el.html(this.template(this.model.displayAttrs()));
    return this;
  },

  events: {
    'click': 'update'
  },

  update: function() {
    this.controller.update(this.model.id);
  }

});

  return RowsView;
});
