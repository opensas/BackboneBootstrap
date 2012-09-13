/*globals define*/
'use strict';

define(
  ['jquery', 'lodash', 'backbone', 'src/models/BaseModel',
  'src/utils/toastMessage'],
  function( $, _, Backbone, BaseModel, ToastMessage) {

var BaseCollection = Backbone.Collection.extend({

  model: BaseModel,

  // array of columns to be rendered by RowsView view and TableView
  // it should have the form:
  // [
  //   { field: 'fieldname1', label: 'field1 label', order: 'fieldname1' }
  // ]
  // Order is the expression to order by, if not specified it assumes it to be the field
  // Specify false to stop that column to be ordered
  tableFields: undefined,

  page   : 1,
  len    : 10,
  order  : '',
  filter : '',
  query  : '',
  total  : -1,

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

  setQuery: function (value) {
    if (value !== undefined && value !== this.query) {
      this.query = value;
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

    if (options.url) { this.url = options.url; }

    if (options.params) { this.setParams(options.params); }

    _.bindAll(this, 'fetch', 'fetch_total');
  },

  setParams: function (params) {
    if (!params) { params = {}; }
    this.setPage(params.page);
    this.setLen(params.len);
    this.setOrder(params.order);
    this.setFilter(params.filter);
    this.setQuery(params.q);
  },

  getParams: function () {
    var params = {};
    params.page = this.page;
    params.len = this.len;
    if (this.order) { params.order = this.order; }
    if (this.filter) { params.filter = this.filter; }
    if (this.query) { params.q = this.query; }
    return params;
  },

  fetch: function (options) {
    // Add process to show
    ToastMessage.addProcess();

    options = options || {};
    var that = this;
    var success = options.success;
    var options = {
      silent: true,       // will manually trigger reset event after fetching the total
      data: this.getParams(),
      success: function (collection, resp) {
        that.fetch_total();
        
        // Remove process to show
        ToastMessage.removeProcess();
        if (success) success(collection, resp);
      },
      error: function() {
        ToastMessage.removeProcess();
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
        ToastMessage.removeProcess();
        return true;
      },
      error: function() {
        ToastMessage.removeProcess();
      }
    };
    ToastMessage.addProcess();
    return $.ajax(options);
  }

});

  return BaseCollection;
})