/*globals define, app, alert*/

define( [
    'jquery', 'lodash',
    'src/controllers/ApplicationController',
    'text!src/views/crud/crud.html',
    'src/views/crud/TableView', 'src/views/crud/RowsView',
    'src/views/crud/FormView', 'src/views/crud/QueryView',
    'src/utils/http'
  ], function(
    $, _,
    ApplicationController,
    crudTemplate,
    TableView, RowsView,
    FormView, QueryView,
    http
  ){

'use strict';

var CrudController = ApplicationController.extend({

  defaults: {
    el          : undefined,
    $el         : undefined,
    $crudEl     : undefined,

    readOnly    : false,
    name        : undefined,
    fullName    : undefined,

    mode        : undefined,          // list, show, create, update, delete
    model       : undefined,

    queryParams : {},

    TableView :TableView,
    RowsView  :RowsView,
    FormView  :FormView,
    QueryView :QueryView,

    formTemplate: undefined,
    queryTemplate: undefined     // initally we are in browse mode, no current model
  },

  initialize: function(options) {

    options = options || {};

    _.extend(this, this.defaults, options);

    // super.initialize
    ApplicationController.prototype.initialize.call(this, options);

    _.bindAll(this, 'list', 'filter', 'edit', 'save', 'saveSuccess', 'del');

    if (!this.Collection) throw new Error('Collection not specified!');

    this.Model = this.Model || this.Collection.prototype.model || undefined;
    if (!this.Model) throw new Error('Model not specified!');

    // try get the resource from the collection
    if (this.resource === undefined) {
      this.resource = this.Collection.prototype.resource || undefined;
    }

    if (this.resource !== undefined) {
      this.readOnly = app.user.canReadOnly(this.resource);
    }

    //#TODO - send user back to home controller
    if (this.resource && !app.user.can(this.resource, '*')) {
      this.modalError("No tiene permisos para consultar esta información");
    }

    // try to get the name from the collection
    this.name = this.name || this.Collection.prototype.name || undefined;
    if (!this.name) throw new Error('Name not specified!');

    this.fullName = this.fullName || this.name;

    // instantiate collection
    this.collection = new this.Collection();

    // create the div that will contain al the child forms
    // and initialized this.$el and this.$crudEl
    this._createContainer();

    // try to get the tableField (columns) from the collection
    this.tableFields = this.tableFields || this.collection.tableFields;

    // table view is initially rendered
    // no need to wait for the collection to be fetched
    this.tableView = new this.TableView({
      controller  : this,
      el          : this.$crudEl.find('.table-view'),
      collection  : this.collection,
      tableFields : this.tableFields
    }).render();

    // initially rendered
    // no need to wait for the collection to be fetched
    this.queryView = new this.QueryView({
      controller  : this,
      el          : this.$crudEl.find('.tablePars.advance'),
      template    : this.queryTemplate,
      collection  : this.collection
    }).render();

    // will render on collection reset (when it's finally fetched)
    this.rowsView = new this.RowsView({
      controller  : this,
      el          : this.$crudEl.find('.table-view tbody'),
      collection  : this.collection
    });

    // will render on create, edit, del
    this.formView = new this.FormView({
      controller : this,
      el         : this.$crudEl.find('.form-view'),
      template   : this.formTemplate,
      collection : this.collection
    });

  },

  /**
   * Generates the html container of the crud forms
   * and assign this.$el and this.$crudEl
   *
   * @chainable
   *
   * Generates the container for an html like the following
   *
   * <div id="controller-container" class="container">
   *   <div id="Invoice-crud">
   *   <div class="header-view"></div>
   *   <div class="table-view" style=""></div>
   *   <div class="form-view" style="display: none;"></div>
   * </div>
   *
   */
  _createContainer: function() {
    var crudId = this.fullName + '-crud';

    this.$el = $(this.el);

    var crudHtml = _.template(crudTemplate, {
      crudId: crudId
    });

    this.$el.append(crudHtml);

    this.$crudEl    = this.$el.find('#' + crudId);

    return this;
  },

  hide: function() {
    this.$crudEl.hide();
  },

  show: function() {
    this.$crudEl.show();
  },

  // to be overwritten by CrudParentController class
  isParent: function() { return false; },

  // to be overwritten by CrudChildController class
  isChild: function() { return false; },

  /**
   * Initially starts in list mode.
   *
   * This fires the fetching of the collection, which will itself fire
   * the rendering of rowsView.
   *
   * @param  {Object} options Options to pass to super.start
   *
   * @chainable
   */
  start: function(options) {
    ApplicationController.prototype.start.call(this, options);
    this.list();
    return this;
  },

  filter: function(filterCondition) {

    // apply the quick filter to columns
    // that are visible in the table
    var filterBy = _.map(this.tableFields, function(tableField) {
      return tableField.displayTemplate;
    }).join(',');

    this.list({ filter: filterCondition, filterBy: filterBy });
    return this;
  },

  list: function(queryParams) {
    this.model = undefined;
    this.mode = 'list';

    _.extend(this.queryParams, queryParams);

    this.collection.setParams(this.queryParams).fetch();

    this.formView.hide();
    this.tableView.show();
  },

  update: function(id) {
    this.edit(id);
  },

  create: function() {
    this.edit();
  },

  edit: function(id) {
    if (id) {   // update
      this.model = this.collection.get(id);
      this.mode = this.readOnly ? 'show' : 'update';
    } else {    // create
      this.model = new this.Model();
      this.mode = 'create';
    }

    this.formView.setModel(this.model).render();

    this.tableView.hide();
    this.formView.show();
  },

  save: function() {
    if (this.model.isNew()) {
      this.collection.create(this.model, { success: this.saveSuccess });
    } else {
      this.model.save(null, { success: this.saveSuccess });
    }
  },

  saveSuccess: function(model, resp) {
    var msg = 'La operación ha sido exitosa.';

    switch(this.mode) {
    case 'delete':
      msg = 'El registro ha sido eliminado con éxito.'; break;
    case 'update':
      msg = 'El registro ha sido modificado con éxito.'; break;
    case 'create':
      msg = 'El registro ha sido creado con éxito.'; break;
    }

    this.list();
    this.success(msg);
  },

  del: function(id) {
    var self = this,
        prevMode = this.mode;

    this.mode = 'delete';

    this.model = this.collection.get(id);
    if (!this.model) {
      this.list();
      this.error('El registro especificado no se ha encontrado');
      return this;
    }

    this.modalConfirmDelete(function() {
      self.model.destroy( {
        wait: true,
        success: function() {
          self.list();
          self.info('El registro se ha eliminado con éxito');
        },
        error: function() {
          self.mode = prevMode;
          self.error('No se ha podido eliminar el registro');
        }
      });
    });

    return this;
  }

});

  return CrudController;
});
