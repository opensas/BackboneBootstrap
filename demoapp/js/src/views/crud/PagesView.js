/*globals define,app,PageView*/

define( [
    'jquery', 'lodash', 'src/views/BaseView',
    'src/utils/crud'
  ], function(
    $, _, BaseView, crud
  ) {

'use strict';

var PagesView = BaseView.extend({

  paginate: undefined,

  initialize: function(options) {
    options = options || {};
    BaseView.prototype.initialize.call(this, options);

    this.collection.on('reset', this.render, this);
    this.collection.on('change', this.render, this);
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
      model: page, controller: this.controller
    });
    this.$('ul').append(view.render().el);
  },

  template: _.template(' \
      <div id="dynamic_info" class="dataTables_info"> \
        <div><%= from %>-<%= to %> de <%= total %></div> \
      </div> \
      <div class="pagination page"> \
        <ul> \
        </ul> \
      </div> \
  ')
});

var PageView = BaseView.extend({

  tagName: 'li',

  initialize: function(options) {
    options = options || {};
    BaseView.prototype.initialize.call(this, options);

    _.bindAll(this, 'page');
  },

  render: function() {
    this.$el.html(this.template(this.model));
    return this;
  },

  events: {
    'click': 'page'
  },

  page: function(e) {
    e.preventDefault();
    var a = this.$('a');

    if (a.hasClass('disabled') || a.hasClass('active')) { return; }

    this.controller.list({ page: this.model.page });
  },

// <div class="dataTables_paginate paging_full_numbers" id="dynamic_paginate">
//    <a tabindex="0" class="first paginate_button paginate_button_disabled" id="dynamic_first">First</a>
//    <a tabindex="0" class="previous paginate_button paginate_button_disabled" id="dynamic_previous">Previous</a>
//    <span>
//       <a tabindex="0" class="paginate_active">1</a>
//       <a tabindex="0" class="paginate_button">2</a>
//       <a tabindex="0" class="paginate_button">3</a>
//       <a tabindex="0" class="paginate_button">4</a>
//       <a tabindex="0" class="paginate_button">5</a>
//     </span>
//     <a tabindex="0" class="next paginate_button" id="dynamic_next">Next</a>
//     <a tabindex="0" class="last paginate_button" id="dynamic_last">Last</a>
// </div>

  template: _.template('<a class=<%= enabled ? "" : "disabled"%> <%= active ? "active" : ""%> href="#"><%= text %></a>')
/*
' \
        <li class="<%= enabled ? "" : "disabled"%> <%= active ? "active" : ""%>"> \
          <a href="#"><%= text %></a> \
        </li> \
  '
*/
});

  return PagesView;
});
