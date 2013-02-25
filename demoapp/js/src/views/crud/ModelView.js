/*globals define*/

define( [
    'lodash', 'jquery',
    'src/views/BaseView', 'src/controls/BaseControl',
    'text!./form.html',
    'src/utils/models/FieldCollection'
  ], function(
    _, $,
    BaseView, BaseControl,
    formTemplate,
    FieldCollection
  ) {

'use strict';

/**
 * ModelView renders a list of controls bound to a model's field list.
 *
 * By default, ModelView will get the fields list from model.fields, and the
 * controls list from the controls associated with each field. You can
 * overwrite these values passing fields or controls to the constructor or
 * calling setFields or setControls.
 *
 * @class ModelView
 * @extends BaseView
 */
var ModelView = BaseView.extend({

  /**
   * @property {BaseModel} model The model to use as source for the controls.
   */
  model    : undefined,

  /**
   * @property {FieldCollection} fields The fields to use as source for
   *                                    the controls.
   */
  fields   : undefined,

  /**
   * @property {Array<BaseControl>} controls The collection of controls to
   *                                         render.
   */
  controls : undefined,

  /**
   * @property {string\function(object)} template Template with placeholders for
   *                                              the controls.
   *
   * The template should have placeholders for each control. Each placeholder
   * will then be replaced by the result of rendering the control. The
   * placeholder should have as id the fullName of the field, like this example:
   *
   *   <h3>Invoice information</h3>
   *   <div id='invoiceId' />
   *   <div id='date' />
   *   <div id='amount' />
   *
   *   <h3>Select a customer</h3>
   *   <div id='customer.customerId' />
   *
   * If no template is specified, a default one will be created with a
   * placeholder for each control.
   */
  template : undefined,

  /**
   * @property {string\function(object)} containerTemplate Template wrapper
   * around to display information around the controls template.
   *
   * The container template is just a wrapper around the template. It should
   * contain a '%controls' like this example:
   *
   * <h2>Edit invoice information</h2>
   * %controls%
   *
   * <div class='tip'>Click on save or cancel to finish edition</div>
   *
   * If no template is specified, a default one will be created with just a
   * '%controls%' placeholder.
   */
  containerTemplate: undefined,

  initialize: function(options) {
    options = options || {};

    _.defaults(this, options);

    BaseView.prototype.initialize.call(this, options);

    this.template = undefined;

    if (this.model) this.setModel(this.model);

    this.setFields(this.fields);

    this.controls = this.controls || undefined;

    this.title = this.title || '';

    if (this.template) this.template = this.compileTemplate(this.template);

    if (!this.containerTemplate) this.containerTemplate = '%controls%';
  },

  /**
   * Set the model to use for this view.
   *
   * By default, it will take the fields collection from the model to use for
   * the view.
   *
   * It will call call setFields and setControls to bind everything to the
   * model.
   *
   * @param {src.BaseModel} model Model instance to use for rendering the view.
   *
   * @chainable
   */
  setModel: function(model) {
    this.model = model;
    if (this.model) {

      // use the fields from model.fields if not specified
      if (!this.fields || this.fields.length === 0) this.fields = this.model.fields;

      // bind model to the fields, it will also bind the fields to the model
      if (this.fields) this.setFields(this.fields);
    }
    return this;
  },

  /**
   * Set the fields collection to use for this view.
   *
   * It will bind each field to the current model.
   *
   * By default, it will take the controls from the field collection to use for
   * the view.
   *
   * It will call setControls bind everything to the model.
   *
   * @param {Array<src.Field>\Array<Object>|FieldCollection} fields
   *              Fields to use for this view.
   *
   * @chainable
   */
  setFields: function(fields) {
    if (!fields || fields.length === 0) this.fields = undefined;
    else {
      if (!this.fields instanceof FieldCollection) {
        this.fields = new FieldCollection(fields);
      }

      // bind model to the fields, it will also bind each fields to the model
      if (this.model) this.model.setFields(this.fields);

      // by default, assign controls from fields
      if (!this.controls || this.controls.length === 0) {
        this.controls = this.fields.controls();
      }
      // rebind controls to field
      this.setControls(this.controls);
    }
    return this;
  },

  /**
   * Set the controls collection to use for this view.
   *
   * It will bind each control to the corresponding field.
   *
   * Each control can be either an instance of BaseControl or a string with the
   * name of a field. In this case, it will be used the contol associated with
   * that field.
   *
   * Finally it will add each control as a subview of this view.
   *
   * @param {Array<src.BaseControl|string>} controls
   *              Controls to use for this view.
   *
   * @chainable
   */
  setControls: function(controls) {
    if (!controls || controls.length === 0) this.controls = undefined;
    else {

      this.controls = _.map(controls, function(control) {
        var field;

        if (!control instanceof BaseControl && !_.isString(control)) {
          throw new Error('control should be an instance of BaseControl or a string with the field name');
        }

        // try to find a field with the name of the control
        if (_.isString(control)) {
          field = this.fields.findByName(control);
          if (!field) throw new Error('could not find a field with name "' + control + '".');
          control = field.control;
        }

        // rebind control to corresponding field
        control.field = this.fields.findByName(control.field.name);
        if (!control.field) throw new Error('could not bind control to field "' + control.field.name + '".');

        return control;
      }, this);

    }

    //add each control as a subview
    this.destroyViews();
    _.each(this.controls, function(control) {
      this.views.push(control);
    }, this);

    return this;
  },

  /**
   * It ensures that we have a valid template before rendering.
   *
   * If a template is specified, it should create placeholders for each control.
   *
   * Otherwise, a default template will be dinamycally created using
   * containerTemplate and the array of controls.
   *
   * @chainable
   */
  loadTemplate: function() {

    // template has been specified
    // make sure that it's a function
    if (this.template) {
      this.template = this.compileTemplate(this.template);
      return this;
    }

    // template not specified,
    // dynamically generate a default template to allocate every control
    var controlsTemplateSrc = '',
        templateSrc;

    _.each(this.controls, function(control) {
      controlsTemplateSrc += '<div id="' + control.field.fullName + '" />\n';
    }, this);

    templateSrc = this.containerTemplate.replace('%controls%', controlsTemplateSrc);

    this.template = this.compileTemplate(templateSrc);

    return this;
  },

  /**
   * Renders the ModelView template. The template will receive the model
   * attributes as data. It accepts an optional templateData parameter with
   * in order to supply aditional data to pass to the template.
   *
   * @param  {Object} templateData Aditional data to pass to the template.
   *
   * It will render the template and then call this.renderControls to attach
   * and render each control.
   *
   * @chainable
   */
  render: function(templateData) {

    // allow to overwrite and pass aditional data for rendering
    var data = _.extend(this.model.toJSON(), templateData || {});

    // make sure we have a template ready
    this.loadTemplate();

    // render template
    this.$el.html(this.template(data));

    // attach to dom and render controls
    this.renderControls();

    this._popoverInit();

    return this;
  },

  /**
   * Destroy each control and calls super.DestroyViews.
   *
   * @override
   * @chainable
   */
  destroyViews: function() {
    _.each(this.controls, function(control) {
      control.destroy();
    }, this);
    return BaseView.prototype.destroyViews.call(this);
  },

  /**
   * Shows the current view and sets focus to the first visible control.
   *
   * @override
   * @chainable
   */
  show: function() {
    BaseView.prototype.show.apply(this, arguments);
    this.focusFirst();
    return this;
  },

  /**
   * Sets focus to the first editable control in controls collection.
   *
   * @chainable
   */
  focusFirst: function() {
    var firstEditable = _.find(this.controls, function(control) {
      return control.editable;
    });
    if (firstEditable) firstEditable.focus();
    return this;
  },

  /**
   * Attaches and renders every control in the controls array, calling
   * this.renderControl for each control.
   *
   * @return {this}   returns a reference to this to chain actions
   *
   * @chainable
   */
  renderControls: function() {
    _.each(this.controls, function(control) {
      this.renderControl(control);
    }, this);
    return this;
  },

  /**
   * Attaches and renders a control to the current view.
   *
   * First it attempts to attach the control to a placeholder in the dom.
   * The fully qualified name of the control should be the id of each
   * placeholder.
   *
   * If no dom element is found it raises an error.
   *
   * Then it initializes the control and renders it.
   *
   * @return {this}   returns a reference to this to chain actions.
   *
   * @chainable
   */
  renderControl: function(control) {
    var $el = this.$byId('#' + control.field.fullName);
    if ($el.length === 0) throw new Error('could not render control. Placeholder with id "' + name + '" not found.');

    control.el = $el;
    control.init();
    control.render();
    return this;
  },

  _popoverInit: function() {
    var isPopoverVisible = false,
        clickedOnPopover = false,
        onPopoverClick,
        onDocumentClick;

    // show popover
    // set flags: popover is visible, last click was on popover
    onPopoverClick = function(e) {
      $(this).popover('show');
      isPopoverVisible = clickedOnPopover = true;
      //e.preventDefault();
    };

    onDocumentClick = function(e) {
      // hide popover if it's visible and user clicked outside of a popover
      if (isPopoverVisible && !clickedOnPopover) {
        $('[rel=popover]').each(function() {
          $(this).popover('hide');
        });
        isPopoverVisible = clickedOnPopover = false;
      } else {
        clickedOnPopover = false;
      }
    };

     this.$('[rel=popover]').each(function() {
        $(this).popover({
            html    : true,
            trigger : 'manual'
        }).click(onPopoverClick);
    });

    $(document).click(onDocumentClick);

  }

});

  return ModelView;
});
