/*globals define, app, console*/

define( [
    'jquery', 'lodash', 'backbone',
    'src/models/BaseModel'
  ], function(
    $, _, Backbone,
    BaseModel
  ) {

'use strict';

/**
 * Backbone.Collection enhanced with the following features:
 *
 * pagination:    using params.page and params.len
 * ordering:      using params.order
 * quick-filter:  using params.filter & params.filterBy
 * query:         using params.q
 *
 * It also calculates the total of records meeting criteria
 *
 * By default, it is expected to work with a web service that accepts the
 * followgin paramenters:
 *
 * page:     page numberto retrieve
 * len:      record for each page
 * order:    comma separated list of field to order by (supports asc, desc)
 * fiter:    expression to use for a quick filter
 * filterBy: comma separated list of field to use for the quick filter
 * query:    pair of field:condition expressions
 *
 * It should also support an aditional resource to retrieve the amount of
 * records matching the specified criteria
 *
 * @example:
 *
 * http://myapp/api/invoice?
 *   page=1&len=5&
 *   order=date&
 *   filter=Acme&filterBy=company.name,customer.name
 *
 * It will retrieve the first five records in which company or customer name
 * matches 'Acme'
 *
 * http://myapp/api/invoice/count?
 *   page=1&len=5&
 *   order=date&
 *   filter=Acme&filterBy=company.name,customer.name
 *
 * This will retrieve the total amount of records matching the previous criteria
 * (in this case order will be ignored)
 *
 * The q param allows to issue more complex queries, like:
 *
 * http://myapp/api/invoice/count?
 *   q=company.name:*acme*,amount:>200
 *
 * It should return the invoices in which the company name contains 'acme' and
 * the amount is greater than 200.
 *
 * (In fact, the collection will just pass the parameter to the q param, it's
 * upto the web service to decide how to deal with them)
 *
 * @class src.models.BaseCollection
 * @extends Backbone.Collection
 */

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

  page     : 1,
  len      : 10,
  order    : '',
  filter   : '',
  filterBy : '',
  query    : '',
  total    : -1,

  setPage: function(value) {
    value = value || 1;
    if (value !== undefined && value !== this.page) {
      if (value < 1) value = 1;
      this.page = value;
    }
    return this;
  },

  setLen: function(value) {
    value = value || 10;
    if (value !== undefined && value !== this.len) {
      this.len = value;
      this.setPage(1);
    }
    return this;
  },

  setFilter: function(value) {
    value = value || '';
    if (value !== undefined && value !== this.filter) {
      this.filter = value;
      this.setPage(1);
    }
    return this;
  },

  setFilterBy: function(value) {
    value = value || '';
    if (value !== undefined && value !== this.filterBy) {
      this.filterBy = value;
      this.setPage(1);
    }
    return this;
  },

  setQuery: function(value) {
    value = value || '';

    // if it's an object, translate it to a query string
    if (_.isObject(value)) value = this.jsonToQuery(value);

    if (value !== undefined && value !== this.query) {
      this.query = value;
      this.setPage(1);
    }
    return this;
  },

  setOrder: function(value) {
    value = value || '';
    if (value !== undefined && value !== this.order) {
      this.order = value;
      this.setPage(1);
    }
    return this;
  },

  initialize: function(options) {
    options = options || {};
    Backbone.Collection.prototype.initialize.call(this, options);

    if (options.url) this.url = options.url;

    if (options.params) this.setParams(options.params);

    _.bindAll(this, 'fetch', 'fetchTotal');

    this.tableFields = this.model.prototype.tableFields;
    this.queryFields = this.model.prototype.queryFields;
  },

  setParams: function(params) {
    params = params || {};
    this.setPage(params.page);
    this.setLen(params.len);
    this.setOrder(params.order);
    this.setFilter(params.filter);
    this.setFilterBy(params.filterBy);
    this.setQuery(params.q);
    return this;
  },

  /**
   * Translates the params of the collection to the format expected
   * by the underlying web service.
   *
   * The resulting object will be passed as params parameter to ajax call.
   *
   * Default implementation just returns the following translation:
   * {
   *   page: this.page,
   *   len: this.len
   *   order: this.order,
   *   q: this.query,
   *   filter: this.filter,
   *   filterBy: this.filterBy
   * }
   *
   * If your web service expects a different set of parameters you should
   * override this method.
   *
   * @return {Object}   The params object to pass to the web service.
   */
  getParams: function() {
    var params = {};

    if (this.page)      params.page = this.page;
    if (this.len)       params.len = this.len;
    if (this.order)     params.order = this.order;
    if (this.query)     params.q = this.query;
    if (this.filter)    params.filter = this.filter;
    if (this.filterBy)  params.filterBy = this.filterBy;

    return params;
  },

  /**
   * Overrides Backbone.Model.fetch to execute this.fetchTotal
   * right after fetching the collection.
   *
   * If issues another query to the web service to fetch the total of records
   * matching the criteria and saves the result in this.total.
   *
   * It tells backbone not to trigger the reset event after fetching the
   * collection because it will be triggered by fetchTotal after successfully
   * fetching the amount of records matching criteria.
   *
   * @param  {{Object}} options Options to pass to super.fetch
   * @return {[type]}         [description]
   */
  fetch: function(options) {

    // Add process to show
    app.startLoading();

    // TODO: check what happens with options variable, we are missing it
    options = options || {};

    var self = this;
    var success = options.success;

    options = {
      silent  : true,       // will manually trigger reset event after fetching the total
      data    : this.getParams(),
      success : function(collection, resp) {
        self.fetchTotal();

        // Remove process to show
        app.completeLoading();
        if (success) { success(collection, resp); }
      },
      error   : function(obj,error) {
        app.completeLoading();
        console.log(error);
      }
    };
    return Backbone.Collection.prototype.fetch.call(this, options);
  },

  /**
   * Issues the query specified by this.getUrl() appending '/count' and passing
   * this.getParams() as parameters.
   *
   * It's main purpose is to fetch the ammount of records matching the last query.
   *
   * @example
   *
   * After issuing a get request to
   *
   *   http://myapp/api/invoice?q=amount:>200,company.name:acme
   *
   * fetchTotal will execute the following query:
   *
   *   http://myapp/api/invoice/count?q=amount:>200,company.name:acme
   *
   * And save te fetched value in this.total.
   *
   * Then it will trigger a 'reset' event to notify that the collection
   * has been succesfully fetched.
   */
  fetchTotal: function() {
    var self = this;
    var options = {
      url         : this.getUrl() + '/count',
      data        : this.getParams(),
      contentType : 'application/json',
      success     : function(resp, status, xhr) {
        self.total = parseInt(resp, 10);
        self.trigger('reset', self);    // manually trigger reset event after fetching total
        app.completeLoading();
        return true;
      },
      error       : function() {
        app.completeLoading();
      }
    };
    app.startLoading();
    return $.ajax(options);
  },

  getUrl: function() {
    return _.result(this, 'url');
  },

  /**
   * Translates a json object to a string ready to be passed to the q param
   *
   * @example
   *
   * var json = {
   *   amount: '>200',
   *   company: {
   *     name: 'acme'
   *   }
   * }
   *
   * jsonToQuery(json) // -> 'amount:>200,company.name:acme'
   *
   * This is intended to be passed to a web service, like this:
   *
   * http://myapp/api/invoice?q=amount:>200,company.name:acme
   *
   * @param  {Object} json Json expression
   * @return {string}      String expression to pass to the q param
   */
  jsonToQuery: function(json) {
    var sub,
        q = [];

    _.each(json, function(value, key) {
      // recursive call
      if (_.isObject(value)) {
        sub = this.jsonToQuery(value);
        _.each(sub.split(','), function(item) {
          q.push(key +'.' + item);
        });
      } else {
        if (value) q.push(key + ':' + value.toString());
      }
    }, this);

    return q.join(',');
  }

});

  return BaseCollection;
});
