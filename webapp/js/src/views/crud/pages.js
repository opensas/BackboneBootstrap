/*globals define*/
'use strict';

define(
  ['jquery', 'lodash', 'backbone', 'src/utils/crud'],
  function( $, _, Backbone, crud) {

var PagesView = Backbone.View.extend({

  paginate: undefined,

  initialize: function() {
    this.collection.bind('reset', this.render, this);
    this.collection.bind('change', this.render, this);
  },

  render: function() {
    this.paginate = crud.paginate(this.collection);
    this.$el.html(this.template(this.paginate));
    this.addAll();
    return this;
  },

  addAll: function() {
    _.each(this.paginate.pages, function(page) {
      this.addOne(page);
    }, this);
  },

  addOne: function(page) {
    var view = new PageView({
      model: page
    });
    this.$('ul').append(view.render().el);
  },

  template: _.template(' \
      <div class="span6"> \
        <div><%= from %>-<%= to %> de <%= total %></div> \
      </div> \
      <div class="span6"> \
        <div class="pagination page"> \
          <ul> \
          </ul> \
        </div> \
      </div> \
  ')
});

var PageView = Backbone.View.extend({
  tagName: 'li',
  render: function() {
    this.$el.html(this.template(this.model));
    return this;
  },

  events: {
    'click': 'page'
  },

  page: function(e) {
    e.preventDefault();
    var li = this.$('li');

    if (li.hasClass('disabled') || li.hasClass('active')) {
      return;
    }

    app.navigateWith({
      page: this.model.page
    }, {
      trigger: true
    });
  },

  template: _.template(' \
        <li class="<%= enabled ? "" : "disabled"%> <%= active ? "active" : ""%>"> \
          <a href="#"><%= text %></a> \
        </li> \
  ')

});

  return PagesView;
});