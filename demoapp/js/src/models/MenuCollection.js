/*globals define, app*/

define( [
    'lodash',
    'src/models/BaseCollection', 'src/models/MenuModel',
    'src/controls/menu/MenuItem'
  ], function(
    _,
    BaseCollection, Model,
    MenuItem
  ) {

'use strict';

var Collection = BaseCollection.extend({

  name:   'Menues',

  model:  Model,

  url:    app.endpoint + '/' + 'Menu',

  menuAdapter: undefined,

  initialize: function(options) {
    options = options || {};

    _.extend(this, options);

    BaseCollection.prototype.initialize.call(this, options);

    this.menuAdapter = this.menuAdapter || this.defaultMenuAdapter;

    this.useTableCapabilities = options.useTableCapabilities || false;
  },

  defaultMenuAdapter: function(attributes) {
    return new MenuItem(attributes);
  },

  asMenu: function() {
    var menuItems = _.map(this.models, function(model) {
      return new MenuItem(this.menuAdapter(model.attributes));
    }, this);

    var menu = MenuItem.root()
      .loadChildren(menuItems)
      .applyPermissions();

    return menu;
  }

});

  return Collection;
});
