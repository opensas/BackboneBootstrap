/*globals define*/

define( [
    'jquery', 'lodash',
    'src/controllers/CrudController',
    'text!src/views/crud/crudContainer.html',
    'text!src/views/crud/crud.html',
    'src/views/crud/TabsView'
  ], function(
    $, _,
    CrudController,
    crudContainerTemplate,
    crudTemplate,
    TabsView
  ){

'use strict';

var CrudParentController = CrudController.extend({

  children: [],             // child controllers
  tabs: [],                 // child controllers
  currentTab: undefined,

  $containerEl: undefined,

  initialize: function(options) {

    options = options || {};

    this.children = this.children || options.children || [];

    if (this.children.length === 0) { throw new Error('Parent controller has no children defined!'); }

    if (this.parent) {
      throw new Error('CrudParentController cannot have a parent, use CrudChildController or CrudParentChildController instead!');
    }

    // super.initialize
    CrudController.prototype.initialize.call(this, options);

    this.addChildren(this.children);

    this.TabsView = options.TabsView  || this.TabsView || TabsView;

    this.tabsView = new this.TabsView({
      controller  : this,
      el          : this.$containerEl.find('.tabs-view'),
      model       : this.tabs
    });

  },

  createContainer: function() {
    this.$el = $(this.el);

    var containerId = this.fullName + '-container';
    var containerHtml = _.template(crudContainerTemplate, {
      containerId: containerId
    });
    // add the container
    this.$el.append(containerHtml);

    this.$containerEl = this.$el.find('#' + containerId);

    var parentId = this.fullName + '-crud';

    var crudHtml = _.template(crudTemplate, {
      crudId: parentId
    });

    this.$containerEl.append(crudHtml);

    this.$crudEl    = this.$containerEl.find('#' + parentId);

    this.tabs = [{
      name:       this.name,
      $el:        this.$crudEl,
      controller: this,
      active:     false,
      enabled:    true,
      isParent:   true,
      isChild:    false
    }];

    // this.selectTab(this.name);

  },

  addChildren: function(children) {
    var Child, child;

    this.children = [];

    if (!children) { return; }

    _.each(children, function(Child) {

      child = new Child({
        parent:   this,
        el:       this.$containerEl
      });

      if (!child.isChild()) {
        throw new Error('cannot add a controller which is not a child!');
      }

      this.children.push(child);

      this.tabs.push({
        name:       child.name,
        $el:        child.$crudEl,
        controller: child,
        active:     false,
        enabled:    false,
        isParent:   false,
        isChild:    true
      });
    }, this);

  },

  start: function(options) {
    CrudController.prototype.start.call(this, options);
    this.selectTab(this.name);
    this.list();
  },

  selectTab: function(tabName) {
    this.updateTabStatus(false);
    var tab = _.find(this.tabs, function(tab) { return tab.name === tabName; } );
    var controller;

    if (!tab) { throw new Error('Could not find tab with name "' + tabName + '".'); }
    // tab already active, just exit
    if (tab.active) { return; }
    if (!tab.enabled) { throw new Error('The tab "' + tabName + '" is not enabled.'); }

    _.each(this.tabs, function(tab) {
      controller = tab.controller;
      if (tab.name === tabName) {
        tab.active = true;
        if (tab.isChild) {
          controller.setParentModel(this.model); 
          controller.start();
        }
        controller.show();
        this.currentTab = tab;
      } else {
        controller.hide();
        tab.active = false;
      }
    }, this);
    this.tabsView.render();
  },

  updateTabStatus: function(renderView) {
    renderView = (renderView === undefined ? true : renderView);
    _.each(this.tabs, function(tab) {
      // parent tab is always available
      if (tab.isChild) {
        // only enabled if we have a selected model
        tab.enabled = (this.model && !this.model.isNew());
      }
    }, this);
    if (renderView) { this.tabsView.render(); }
  },

  isParent: function() { return true; },

  isChild: function() { return false; },

  list: function(queryParams) {
    var ret = CrudController.prototype.list.call(this, queryParams);
    this.updateTabStatus();
    return ret;
  },

  edit: function(id) {
    var ret = CrudController.prototype.edit.call(this, id);
    this.updateTabStatus();
    return ret;
  },

  del: function(id) {
    var ret = CrudController.prototype.del.call(this, id);
    this.updateTabStatus();
    return ret;
  }

});

  return CrudParentController;
});