/*globals define, app, document, console*/

define( [
    'jquery','jqueryui', 'lodash', 'src/views/BaseView',
    'text!src/views/crud/header.html',
    'src/utils/crud'
  ], function(
    $, jui, _, BaseView,
    headerTemplate,
    crud
  ) {

'use strict';

var HeaderView = BaseView.extend({

  title: '',

  template: undefined,

  fields: undefined,

  initialize: function(options) {
    options = options || {};
    BaseView.prototype.initialize.call(this, options);

    this.title = options.title || '';

    if (options.template) this.template = this.compileTemplate(options.template);

    this.fields = this.fields || options.fields || undefined;

  },

  // check that we have a valid function template
  _ensureTemplate: function() {
    var template = this.template;
    if (_.isFunction(template)) { return; }

    if (!template) { template = this.getDefaultTemplate(); }

    this.template = this.compileTemplate(template);
  },

  // automatically generate a default template from the data in this.fields
  getDefaultTemplate: function() {
    var controlsTemplate = crud.generateFormTemplate(this.fields);
    var template = headerTemplate.replace('%controls%', controlsTemplate);

    return template;
  },

  validateModel: function(model) {
    if (model) { this.model = model; }

    if (!this.model) { throw new Error('model not specified!'); }

    this.title = this.title || this.model.name || '';

    this.fields = this.fields ||
      this.model.headerFields || this.model.formFields || undefined;

    if (!this.template && !this.fields) {
      throw new Error('No template nor fields definition specified!');
    }

  },

  render: function(model) {

    this.validateModel(model);

    this._ensureTemplate();

    var templateData = this.model.toJSON();
    templateData._title = this.title;

    this.$el.html(this.template(templateData));

    // in the header no control is editable
    crud.disableControls(this.el);

    // init
    crud.initControls(this);

    return this;
  }

});

  return HeaderView;
});
