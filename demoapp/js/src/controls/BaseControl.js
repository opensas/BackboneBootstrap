/*globals define, console*/

define( [
    'jquery', 'lodash', 'backbone', 'require',
    'src/views/BaseView',
    'src/utils/models/Field',
    'src/utils/html',
    'text!src/controls/control-container.html'
  ], function(
    $, _, Backbone, require,
    BaseView,
    Field,
    html,
    controlContainerMetaTemplate
  ){

'use strict';

var BaseControl = BaseView.extend({

  supportedTypes: [],

  $input: undefined,

  initialize: function(options) {

    options = options || {};

    _.defaults(this, options);

    BaseView.prototype.initialize.call(this, options);

    if (!this.type) throw new Error('control.type type not specified!');
    this.type = this.type.toLowerCase();

    this.setField(this.field);
    if (!this.field) throw new Error('control.field not specified!');

    this.editable = this.field.editable;
    if (!_.isBoolean(this.editable)) throw new Error('control.editable should be a boolen!');

    this.help = this.help || '';

    this.label = this.label || this.field.label;

    var supportedTypes = BaseControl.prototype.supportedTypes;
    if (!_.contains(supportedTypes, this.type)) {
      throw new Error('control.type "' + this.type + '" not supported, supported types: ' + supportedTypes);
    }

    this.span = this.span || this.field.span || '';

    // by default, no container
    this.containerMetaTemplate = this.containerMetaTemplate || controlContainerMetaTemplate;
    if (!this.containerMetaTemplate) this.containerMetaTemplate = '%control%';

    if (!this.controlTemplate && !this.template) throw new Error('No control.controlTemplate nor control.template defined!');

    if (this.template)  this.template = this.compileTemplate(this.template);
    else                this.compileControlTemplate();

  },

  events: {
    'blur   :input' : 'onUpdateField',
    'change :input' : 'onUpdateField'
  },

  setField: function(field) {
    if (this.field) this.field.off(null, null, this);

    if (field) {

      // check field type - circular reference!!!
      // check http://requirejs.org/docs/api.html#circular
      if (!Field) Field = require('src/utils/models/Field');

      // see http://stackoverflow.com/questions/15047317/how-to-implement-instanceof-as-a-function-receiving-a-string/15051882#15051882
      if (!field instanceof Field) throw new Error('field should be an instance of Field');

      this.field = field;
      this.field.on('validate', this.renderErrors, this);
    }
    return this;
  },

  /**
   * Process the blur and change event of the control.
   *
   * It updates the value of the underlaying field and triggers field
   * validation.
   *
   * If it's a new record, only process it on blur. If we are editing an exiting
   * record only process it on change. (The idea es that when creating a new
   * record, errors will only be displayed if the user leaves the field without
   * entering a valid value).
   *
   * You can override this beahviour using the forceUpdate argument. If
   * forceUpdate is true, the field will be updated without cheking the status
   * of the record or the triggering event.
   *
   * @param  {Event} e             The event fired by the control
   * @param  {Boolean} forceUpdate Update the field no matter the event that
   *                               triggered the update.
   * @return {Boolean}   [description]
   */
  onUpdateField: function(e, forceUpdate) {

    var field   = this.field,
        isNew   = this.field.model.isNew(),
        id      = '#' + field.fullName,
        control;

    forceUpdate = (forceUpdate === undefined ? false : forceUpdate);

    if (!forceUpdate) {
      // new record -> only process blur (lost focus) event
      if (isNew && e.type !== 'focusout') return false;

      // existing record -> only process change event
      if (!isNew && e.type !== 'change') return false;
    }

    control = this.$byId(id);
    if (control.length === 0) throw new Error('could not find control with id "' + id + '".');

    // this will automatically trigger the validation
    field.formattedVal(control.val(), {validate: true});
    // and now, update the control, just in case the value of the field changed
    control.val(field.formattedVal());

    return true;
  },

  render: function() {
    if (!this.el) throw new Error('can not render control. el not specified');

    this.$el = $(this.el);
    if (this.$el.length === 0) throw new Error('can not render control, could not find placeholder for control');

    this.onRender();

    // add data for rendering
    this.spanClass = this.span ? 'span' + this.field.span : '';
    this.disabled = this.editable ? '' : 'disabled';
    this.value = this.field.formattedVal();

    // var $control = $(this.template(this.model.attributes));
    var $control = $(this.template(this));

    this.$el.replaceWith($control);

    // call view.setElement to re-delegateEvents to view.$el
    this.setElement($control);

    this.$input = this.$byId('#' + this.field.fullName);

    this.renderErrors();

    this.afterRender();

    return this;
  },

  renderErrors: function() {
    var field  = this.field,
        errors = field.errors,
        $container, $error;

    if (this.$input.length === 0) {
      throw new Error('controll with id"' + field.fullName + '" not found.');
    }

    // $container = this.$input.parent();
    $container = this.$el;
    $error = $container.find('ul');

    if (field.isValid()) {
      this.$input.removeAttr('error');
      $container.removeClass('error');
      $error.html('');
    } else {
      this.$input.attr('error', 'true');
      $container.addClass('error');

      $error.html('');
      // for each error for this particular field
      _.each(errors, function(error) {
        $error.append('<li>' + error.message + '</li>');
      }, this);
    }

    return this;
  },

  focus: function() {
    if (this.$input.length > 0) this.$input[0].focus();
    return this;
  },

  compileControlTemplate: function() {
    // the meta template with the container and the control
    this.templateSrc = this.containerMetaTemplate.replace(
      '%control%', this.controlTemplate
    );
    this.template = this.compileTemplate(this.templateSrc);
  },

  addSupportedType: function(type) {
    if (_.contains(BaseControl.prototype.supportedTypes, type)) return this;
    BaseControl.prototype.supportedTypes.push(type);
  },

  // put any needed initialization code here
  // return a reference to this for method chaining
  init: function() {
    return this;
  },

  // put any needed cleanup code here
  // return a reference to this for method chaining
  // Don't forget to call super.destroy to clean up everything
  destroy: function() {
    return BaseView.prototype.destroy.apply(this, arguments);
  },

  disable: function() {
    if (this.$input.length > 0) {
      html.disable(this.$input);
      this.editable = false;
    }
    return this;
  },

  enable: function() {
    if (this.$input.length > 0 && this.field.editable) {
      html.enable(this.$input);
      this.editable = true;
    }
    return this;
  }

});

// give the object the ability to bind and trigger custom named events.
_.extend(BaseControl.prototype, Backbone.Events);

  return BaseControl;
});
