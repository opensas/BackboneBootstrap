/*globals define, alert, confirm*/

define( [
    'jquery', 'lodash', 'backbone',
    'app/config',
    'src/models/wineModel', 'src/models/wineCollection',
    'src/views/crud/table', 
    'src/views/wine/rows', 'src/views/wine/form',
    'text!src/routers/main-menu.html',
    'text!src/routers/accessibility-bar.html',
    'text!src/routers/tabs-bar.html',
    'text!src/routers/messages.html',
    'src/utils/http', 'src/utils/errorManager'
  ], function( $, _, Backbone,
    config,
    WineModel, WineCollection,
    TableView, RowsView, FormView,
    mainMenuTemplate, accessibilityBarTemplate, tabsBarTemplate, messagesTemplate,
    http, ErrorManager ) {

'use strict';

var Router = Backbone.Router.extend({

  routes: {
    '':                         'list',
    'wines':                    'list',
    'wines?*url':               'list',
    'wines/new':                'edit',
    'wines/del/:id':            'del',
    'wines/:id':                'edit',
    'errors':                   'testErrors'
  },

  initialize: function() {

    this.config = config;

    _.bindAll(this, 'del', 'test');
    //new src.views.widgets.MainMenuView({el: '#main-menu'}).render();

    $('#main-menu-view').replaceWith(mainMenuTemplate);
    $('#accessibility-view').replaceWith(accessibilityBarTemplate);
    $('#tabs-view').replaceWith(tabsBarTemplate);
    $('#messages-view').replaceWith(messagesTemplate);

    this.collection = new WineCollection( {
      url: config.endpoint
    });
    this.model = undefined;

    this.formView = undefined;

    new TableView({
      el: '#table-view', collection: this.collection
    }).render();

    new RowsView({
      el: '#table-view tbody', collection: this.collection
    });

    Backbone.history.start();
  },

  list: function(query) {
    this.collection.setParams(http.parseQuery(query));

    this.collection.fetch();
    $('#form-view').show();
  },

  edit: function(id) {
    this.model = id ? this.collection.get(id) : new WineModel();
    
    this.formView = new FormView({
      el: '#form-view', model: this.model, collection: this.collection
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

  testErrors: function() {
    this.collection.fetch({
      success: this.test
    });
  },

  test: function() {
    this.model = this.collection.at(1);
    
    new FormView({
      el: '#form-view', model: this.model, collection: this.collection
    }).render();

    // mock response
    var response = {
      responseText: '\
[\
{"field":"","errorCode":10000,"status":400,"developerMessage":"Error performing operation","message":"General error"},\
{"field":"name","errorCode":10000,"status":400,"developerMessage":"Error performing operation","message":"Name not specified"},\
{"field":"name","errorCode":10000,"status":400,"developerMessage":"Error performing operation","message":"Another error for name"},\
{"field":"year","errorCode":10000,"status":400,"developerMessage":"Error performing operation","message":"Year can\'t be greater than current year"}\
]'
    };
    var err = new ErrorManager({
      response: response,
      el: 'div#form-view'
    });
    err.render();
  },

  routeWith: function(params) {
    return http.addParams(Backbone.history.getHash(), params);
  },

  navigateWith: function(params, options) {
    this.navigate(this.routeWith(params), options);
  }

});

  return Router;
});