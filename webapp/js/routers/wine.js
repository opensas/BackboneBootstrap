/*globals $,_,Backbone,src:true,utils,confirm,alert*/

'use strict';
var src = src || {};
src.routers = src.routers || {};

src.routers.wine = Backbone.Router.extend({

  routes: {
    '':                         'list',
    'wines':                    'list',
    'wines?*url':               'list',
    'wines/new':                'edit',
    'wines/del/:id':            'del',
    'wines/:id':                'edit'
  },

  initialize: function() {
    new src.views.widgets.NavBarView({el: '#navbar'}).render();
    new src.views.widgets.BreadCrumbView({el: '#breadcrumb'}).render();

    this.collection = new src.models.Wines();
    this.model = undefined;

    new src.views.crud.TableView({
      el: '#wines', collection: this.collection
    }).render();

    new src.views.wine.RowsView({
      el: '#wines tbody', collection: this.collection
    });

    //this.collection.fetch();

    Backbone.history.start();
  },

  list: function(query) {
    //if (this.wineFormView) {this.wineFormView.close();}
    this.collection.setParams(utils.http.parseQuery(query));

    this.collection.fetch();
    $('#wines').show();
  },

  edit: function(id) {
    this.model = id ? this.collection.get(id) : new src.models.Wine();
    
    //if (this.wineFormView) {this.wineFormView.close();}
    new src.views.wine.FormView({
      el: '#wineForm', model: this.model, collection: this.collection
    }).render();
  },

  del: function(id) {
    this.model = this.collection.get(id);
    if (!this.model) {
      alert('Item not found');
      this.navigate('wines', {trigger: true});
      return;
    }
    if (confirm('are you sure you want to delete the current record?')) {
      var that = this;
      this.model.destroy({success: function() {
        that.navigate('wines', {trigger: true});
      }});
      //this.navigate('wines', {trigger: true});
      return;
    } else {
      this.navigate('wines', {trigger: false});
    }
  },

  routeWith: function(params) {
    return utils.http.addParams(Backbone.history.getHash(), params);
  },

  navigateWith: function(params, options) {
    this.navigate(this.routeWith(params), options);
  }

});