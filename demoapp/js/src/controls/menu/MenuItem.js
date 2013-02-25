/*globals define, app*/

/*
se encarga de la comunición con meta
config: puede sobreescribir application, endpoint, template
*/

define( [
    'lodash'
  ], function(
    _
  ) {

'use strict';

var MenuItem = function(options) {

  options = options || {};

  _.extend(this, options);

  if (this.id !== 0) this.id = this.id || undefined;

  if (this.id === undefined) throw new Error('menu id not defined');

  this.type = this.type || 'menu';

  this.parentId = this.parentId || null;

  this.order = this.order || undefined;

  this.name = this.name ||undefined;
  if (this.name === undefined) throw new Error('menu name not defined');

  this.description = this.description || '';

  this.url = this.url || '';

  this.resource = this.resource || '';

  this.help = this.help ||'';

  this.show = (this.show === undefined ? true : this.show);

  this.level = (this.level === undefined ? 0 : this.level);

  this.children = this.children || [];

};

MenuItem.prototype = {

  hasChildren: function() {
    return (this.children ? this.children.length > 0 : false);
  },

  isParent: function() {
    // return (!this.isSep() && (!this.url || this.url === '#'));
    return (!this.isSep() && (!this.url || this.url === ''));
  },

  isSep: function() {
    return ((this.type || '') === 'sep');
  },

  loadChildren: function(items) {
    // get only the childs of this menu
    var children = _.filter(items, function(item) {
      return item.parentId === this.id;
    }, this);

    if (children.length === 0) {
      this.children = [];
      return this;
    }

    // order by order
    children = _.sortBy(children, function(child) {
      return child.order;
    }, this);

    // instantiate a new Menu for every child item
    children = _.map(children, function(child) {
      child.level = this.level + 1;
      return new MenuItem(child);
    }, this);

    // recursive call to load the children of each child
    _.each(children, function(child) {
      child.loadChildren(items);
    }, this);

    this.children = children;

    return this;
  },

  applyPermissions: function() {
    this._applyPermissions();
    this.removeInvisibleItems();
    return this;
  },

  _applyPermissions: function() {

    if (_.isUndefined(app) || !app || !app.user) {
      throw new Error('app.user has not been loaded yet');
    }

    if (this.isSep()) {
      this.enabled = true;
    } else if (!this.resource) {
      this.enabled = true;
    } else if (app.user.can(this.resource)) {
      this.enabled = true;
    } else {
      this.enabled = false;
    }

    this.visible = (this.enabled || this.show);

    _.each(this.children, function(child) {
      child._applyPermissions();
    });

  },

  removeInvisibleItems: function() {

    if (!this.hasChildren()) { return; }

    // process each child
    _.each(this.children, function(child) {
      // delete child.visible;     // no longer needed, only visible items remained
      child.removeInvisibleItems();
    });

    var prev = null;
    this.children = _.filter(this.children, function(child) {
      // first sep is removed
      if (prev === null && child.isSep()) { return false; }

      // avoid two seps together
      if (prev && prev.isSep() && child.isSep()) { return false; }

      // get rid of invisible items
      if (child.visible === false) { return false; }

      // parent left with no childs
      if (child.isParent() && !child.hasChildren()) { return false; }

      prev = child;

      return true;
    });

    // remove last item if it's a sep
    if (this.hasChildren() && _.last(this.children).isSep()) {
      this.children = _.first(this.children, this.children.length-1);
    }

    _.each(this.children, function(child) {
      delete child.visible;     // no longer needed, only visible items remained
    });

  }

};

MenuItem.root = function() {
  return new MenuItem({
    id:     'root',
    name:   'root',
    level:  0
  });
};

  return MenuItem;
});
