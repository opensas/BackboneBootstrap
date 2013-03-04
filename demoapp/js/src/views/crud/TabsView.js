/*globals define,app,PageView*/

define( [
    'lodash',
    'src/views/BaseView'
  ], function(
    _,
    BaseView
  ) {

'use strict';

var TabsView = BaseView.extend({

  tabView: undefined,

  initialize: function(options) {
    options = options || {};
    BaseView.prototype.initialize.call(this, options);

    this.el = options.el || this.el || undefined;
    if (!this.el) throw new Error('el variable not specified!');

    this.model = options.model || this.model || undefined;
    if (!this.model) throw new Error('model not specified!');

    this.TabView = options.TabView || this.TabView || TabView;
  },

  render: function() {
    this.$el.html(this.template(this.model));
    this.addAll();
    return this;
  },

  addAll: function() {
    _.each(this.model, function(tab) {
      this.addOne(tab);
    }, this);
  },

  addOne: function(tab) {
    var view = new TabView({
      model: tab, controller: this.controller
    });
    this.$('ul').append(view.render().el);
  },

  template: _.template(' \
      <ul class="nav nav-tabs"> \
      </ul> \
  ')
});

var TabView = BaseView.extend({

  tagName: 'li',

  initialize: function(options) {
    options = options || {};
    BaseView.prototype.initialize.call(this, options);

    _.bindAll(this, 'selectTab');
  },

  render: function() {
    // this.$el.html(this.template(this.model));

    this.$el.html(this.template(this.model));
    this.$el.attr('data-toggle', 'tab');
    if (!this.model.enabled) this.$el.addClass('disabled');
    if (this.model.active) this.$el.addClass('active');

    return this;
  },

  events: {
    'click': 'selectTab'
  },

  selectTab: function(e) {
    e.preventDefault();
    var li = this.$el;

    if (li.hasClass('disabled') || li.hasClass('active')) { return; }

    this.controller.selectTab(this.model.name);
  },

// <div class="tabs-view">
//   <ul class="nav nav-tabs">
//     <li><a href="#main" data-toggle="tab">Main</a></li>
//     <li><a href="#tab1" data-toggle="tab">First tab</a></li>
//     <li><a href="#tab2" data-toggle="tab">Second tab</a></li>
//   </ul>
// </div>

  template: _.template(' \
          <a href="#"><%= name %></a> \
  ')
  // template: _.template(' \
  //       <li class="<%= enabled ? "" : "disabled" %> <%= active ? "active" : "" %>" data-toggle="tab"> \
  //         <a href="#"><%= name %></a> \
  //       </li> \
  // ')

});

  return TabsView;
});
