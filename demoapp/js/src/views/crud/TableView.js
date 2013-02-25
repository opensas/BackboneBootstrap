/*globals define,app*/

define( [
    'jquery', 'lodash',
    'src/views/BaseView',
    'text!src/views/crud/table.html',
    'src/views/crud/PageLenView', 'src/views/crud/PagesView', 'src/views/crud/FilterView',
    'src/utils/crud', 'src/utils/html'
  ], function(
    $, _,
    BaseView,
    tableTemplate,
    PageLenView, PagesView, FilterView,
    crud, html
  ) {

'use strict';

var TableView = BaseView.extend({

  titlesHtml: undefined,      // it's not a template, it's the textual html of the titles

  title: '',

  resource: undefined,

  initialize: function(options) {
    options = options || {};

    _.defaults(this, options);

    BaseView.prototype.initialize.call(this, options);

    this.tableFields = this.tableFields || this.collection.tableFields;

    // initialize titlesHtml
    this.titlesHtml = this.titlesHtml ||
      crud.generateTableTitlesHtml(this.tableFields);

    this.resource = this.resource || this.controller.resource || undefined;
    if (this.resource) this.resource = this.resource.toLowerCase();

    this.title = this.title || this.controller.collection.label || this.controller.collection.name || '';

  },

  setPermissions: function() {
    if (this.resource !== undefined) {
      html.enable(this.$('.btn.create'), app.user.can(this.resource, 'alta'));
    }
  },

  render: function() {

    this.template = _.template(tableTemplate);

    this.$el.html(this.template({ _title: this.title }));

    this.$('#headers-view table thead tr').html(this.titlesHtml);

    this.pageLenView = new PageLenView({
       el: this.$('#page-len-view'), collection: this.collection, controller: this.controller
    }).render();

    this.pagesView = new PagesView({
      el: this.$('#pages-view'), collection: this.collection, controller: this.controller
    }).render();

    this.filterView = new FilterView({
      el: this.$('#filter-view'), collection: this.collection, controller: this.controller
    }).render();

     // enable/disable elements according to the user's permission
    this.setPermissions();

    return this;
  },

  events: {
    'click .btn.create'   : 'create',
    'click th[order]'     : 'order',
    'click .tOptions'     : 'showQueryForm'
  },

  order: function(e) {
    var th = $(e.currentTarget),
        order = th.attr('order'),
        direction = th.hasClass('order-asc') ? 'desc' : 'asc';

    this.$('th[order]').each(function() {
      $(this).removeClass('order-asc');
      $(this).removeClass('order-desc');
    });

    th.addClass('order-' + direction);
    this.controller.list( { order: order + ' ' + direction } );
  },

  create: function() {
    this.controller.create();
  },

  showQueryForm: function() {
    this.$('.tablePars.advance').slideToggle(200);
  }

});

  return TableView;
});
