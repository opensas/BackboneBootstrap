/*globals define, alert, confirm*/

define( [
    'jquery', 'lodash', 'backbone',
    'app/config',
    'src/models/BaseModel', 'src/models/BaseCollection',
    'src/views/crud/TableView', 
    'src/views/crud/RowsView', 'src/views/crud/FormView',
    'src/views/widgets/WidgetsView',
    'src/utils/http', 'src/utils/convert', 'src/utils/errorManager',
    'src/utils/toastMessage'
    // ,'src/utils/accessibility'
  ], function( $, _, Backbone,
    config,
    BaseModel, BaseCollection,
    TableView, RowsView, FormView,
    WidgetsView,
    http, convert, ErrorManager, ToastMessage){
    // , accessibility ) {

'use strict';

var Router = Backbone.Router.extend({

  baseUrl: '',

  routes: {},

  initialize: function(options) {

    options = options || {};

    this.config = this.config || options.config || {};
    if (!this.config.endpoint) { throw new Error('Endpoint not specified!'); }

    this.baseUrl = this.baseUrl || options.baseUrl || '';
    if (!this.baseUrl) { throw new Error('baseUrl not specified!'); }

    this.addRoutes(this.baseUrl);

    _.bindAll(this, 'list', 'edit', 'del');

    new WidgetsView({ 
      el : {
        MainMenu:           '#main-menu-view',
        AccessibilityBar:   '#accessibility-view',
        TabsBar:            '#tabs-view',
        Messages:           '#messages-view'
      }
    }).render();

    ToastMessage.init({container: '.loading'});

    this.Model = this.Model || options.Model || BaseModel;
    this.Collection = this.Collection || options.Collection || BaseCollection;

    this.TableView = this.TableView || options.TableView || TableView;
    this.RowsView = this.RowsView || options.RowsView || RowsView;
    this.FormView = this.FormView || options.FormView || FormView;

    this.formTemplate = options.formTemplate || this.formTemplate || undefined;

    this.collection = new this.Collection({
      url: this.config.endpoint + '/' + this.baseUrl
    });
    this.model = undefined;
    this.formView = undefined;

    new this.TableView({
      el: '#table-view', collection: this.collection
    }).render();

    new this.RowsView({
      el: '#table-view tbody', collection: this.collection
    });

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
    $('#form-view').show();
  },

  edit: function(id) {
    this.model = id ? this.collection.get(id) : new this.Model();

    this.formView = new this.FormView({
      el: '#form-view', 
      template: this.formTemplate,
      model: this.model, 
      collection: this.collection
    });
    
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