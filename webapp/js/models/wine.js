/*globals $,_,Backbone,src:true,utils,confirm,alert*/

'use strict';
if (!src) { src = {}; }
if (!src.models) { src.models = {}; }

src.models.Wine = Backbone.Model.extend({
  defaults: {
    'id': null,
    'name': 'new wine',
    'grapes': '',
    'country': '',
    'region': '',
    'year': 2000
  }
});

src.models.Wines = Backbone.Collection.extend({

  model: src.models.Wine,

  url: 'http://localhost:9000/wines',

  page:   1,
  len:    10,
  order:  '',
  filter: '',
  total:  -1,

  setPage: function (value) {
    if (value !== undefined && value !== this.page) {
      if (value < 1) { value = 1 };
      this.page = value;
    }
  },

  setLen: function (value) {
    if (value !== undefined && value !== this.len) {
      this.len = value;
      this.setPage(1);
    }
  },

  setFilter: function (value) {
    if (value !== undefined && value !== this.filter) {
      this.filter = value;
      this.setPage(1);
    }
  },

  setOrder: function (value) {
    if (value !== undefined && value !== this.order) {
      this.order = value;
      this.setPage(1);
    }
  },

  initialize: function (options) {
    if (!options) { options = {}; }
    if (options.params) { this.setParams(options.params); }

    _.bindAll(this, 'fetch', 'fetch_total');
  },

  setParams: function (params) {
    if (!params) { params = {}; }
    this.setPage(params.page);
    this.setLen(params.len);
    this.setOrder(params.order);
    this.setFilter(params.filter);
  },

  getParams: function () {
    var params = {};
    params.page = this.page;
    params.len = this.len;
    if (this.order) { params.order = this.order; }
    if (this.filter) { params.filter = this.filter; }
    return params;
  },

  fetch: function () {
    var that = this;
    var options = {
      silent: true,       // will manually trigger reset event after fetching the total
      data: this.getParams(),
      success: function (collection, resp) {
        that.fetch_total();
      }
    };
    return Backbone.Collection.prototype.fetch.call(this, options);
  },

  fetch_total: function () {
    var that = this;
    var options = {
      url: this.url + '/count',
      data: this.getParams(),
      contentType: 'application/json',
      success: function (resp, status, xhr) {
        that.total = parseInt(resp, 10);
        that.trigger('reset', that);    // manually trigger reset event after fetching total
        return true;
      }
    };
    return $.ajax(options);
  }

});