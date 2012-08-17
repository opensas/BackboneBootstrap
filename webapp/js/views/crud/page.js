/*globals $,_,Backbone,utils,src:true*/

'use strict';
var src = src || {};
src.views = src.views || {};
src.views.crud = src.views.crud || {};

src.views.crud.PagesView = Backbone.View.extend({

  paginate: undefined,

  initialize: function() {
    this.collection.bind('reset', this.render, this);
    this.collection.bind('change', this.render, this);
  },

  render: function() {
    this.paginate = utils.crud.paginate(this.collection);
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
    var view = new src.views.crud.PageView({model: page});
    this.$('ul').append(view.render().el);
  },

  template: _.template(' \
    Showing <%= from %>-<%= to %> of <%= total %> \
    <div class="pagination"> \
      <ul> \
      </ul> \
    </div> \
  ')

});

src.views.crud.PageView = Backbone.View.extend({
  tagName: 'li',
  render: function() {
    this.$el.html(this.template(this.model));
    return this;
  },

  events: {
    'click':    'page'
  },

  page: function(e) {
    e.preventDefault();
    var li = this.$('li');

    if (li.hasClass('disabled') || li.hasClass('active')) { return; }

    app.navigateWith({page: this.model.page}, {trigger: true});
  },

  template: _.template(' \
        <li class="<%= enabled ? "" : "disabled"%> <%= active ? "active" : ""%>"> \
          <a href="#"><%= text %></a> \
        </li> \
  ')

});