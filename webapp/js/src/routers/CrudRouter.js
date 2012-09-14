/*globals define, alert, confirm*/

define( [
    'jquery', 'lodash', 'backbone',
    'app/config',
    'src/models/BaseModel', 'src/models/BaseCollection',
    'src/views/crud/TableView', 'src/views/crud/RowsView',
    'src/views/crud/FormView', 'src/views/crud/QueryView',
    'src/views/widgets/WidgetsView',
    'src/utils/http', 'src/utils/convert', 'src/utils/errorManager',
    'src/utils/toastMessage'
    // ,'src/utils/accessibility'
  ], function(
    $, _, Backbone,
    config,
    BaseModel, BaseCollection,
    TableView, RowsView,
    FormView, QueryView,
    WidgetsView,
    http, convert, ErrorManager, 
    toastMessage
  ){
    // , accessibility ) {

'use strict';

var Router = Backbone.Router.extend({

  baseUrl: '',

  routes: {},

  initialize: function(options) {

    options = options || {};

    this.config = options.config || this.config || {};
    if (!this.config.endpoint) { throw new Error('Endpoint not specified!'); }

    this.baseUrl = options.baseUrl || this.baseUrl || '';
    if (!this.baseUrl) { throw new Error('baseUrl not specified!'); }

    this.addRoutes(this.baseUrl);

    _.bindAll(this, 'list', 'edit', 'del');

    new WidgetsView({ 
      el: {
        mainMenu:           '#main-menu-view',
        accessibilityBar:   '#accessibility-view',
        tabsBar:            '#tabs-view',
        messages:           '#messages-view'
      }
    }).render();

    toastMessage.initialize( {
      el        : '.loading',
      elMessage : '.loading span'
    });

    this.Model      = options.Model || this.Model || undefined;
    if (!this.Model) { throw new Error('Model not specified!'); }

    this.Collection = options.Collection || this.Collection || undefined;
    if (!this.Collection) { throw new Error('Collection not specified!'); }

    this.TableView = options.TableView || this.TableView || TableView;
    this.RowsView  = options.RowsView || this.RowsView || RowsView;
    this.FormView  = options.FormView || this.FormView || FormView;
    this.QueryView = options.QueryView || this.QueryView || QueryView;

    this.formTemplate  = options.formTemplate || this.formTemplate || undefined;
    this.queryTemplate = options.queryTemplate || this.queryTemplate || undefined;

    this.collection = new this.Collection({
      url: this.config.endpoint + '/' + this.baseUrl
    });
    this.model = undefined;

    this.formView = new this.FormView({
      el         : '#form-view',
      template   : this.formTemplate,
      collection : this.collection
    });

    new this.TableView({
      el: '#table-view', collection: this.collection
    }).render();

    new this.RowsView({
      el: '#table-view tbody', collection: this.collection
    });

    new this.QueryView({
      el         : 'div#query-view',
      template   : this.queryTemplate,
      collection : this.collection
    }).render();

    Backbone.history.start();
  },

  addRoutes: function(baseUrl) {
    // Attention, if added with this.route
    // routes are added in the wrong order
    // _bindRoutes reverses the order before adding the routes
    this.routes['']                   = 'list';
    this.routes[baseUrl]              = 'list';
    this.routes[baseUrl+'?*url']      = 'list';
    this.routes[baseUrl+'/del/:id']   = 'del';
    this.routes[baseUrl+'/new']       = 'edit';
    this.routes[baseUrl+'/:id']       = 'edit';

    this._bindRoutes();
  },

  list: function(query) {
    this.collection.setParams(http.parseQuery(query));

    this.collection.fetch();
  },

  edit: function(id) {
    this.model = id ? this.collection.get(id) : new this.Model();

    this.formView.setModel(this.model);
    this.formView.render();
  },

  del: function(id) {
    this.model = this.collection.get(id);
    if (!this.model) {
      alert('Item not found');
      // this.navigate('wines', {trigger: true});
      this.formView.close({trigger: true});
      return;
    }
    if (confirm('are you sure you want to delete the current record?')) {
      var that = this;
      this.model.destroy({success: function() {
        // that.navigate('wines', {trigger: true});
        that.formView.close({trigger: true});
      }});
      return;
    } else {
      window.history.back();  // back to edit form
    }
  },

  routeWith: function(params) {
    return http.addParams(Backbone.history.getHash(), params);
  },

  navigateWith: function(params, options) {
    this.navigate(this.routeWith(params), options);
  },

  navigateToId: function(id, options) {
    this.navigate(this.baseUrl + '/' + id.toString(), options);
  },

  navigateToList: function(options) {
    this.navigate(this.baseUrl, options);
  }

});

  return Router;
});