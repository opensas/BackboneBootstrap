/*globals define,app,PageView*/

define( [
    'jquery', 'lodash',
    'src/views/BaseView',
    'text!src/controls/modal/modal.html'
  ], function(
    $, _,
    BaseView,
    templateModal
  ) {

'use strict';

var ModalView = BaseView.extend({

  initialize: function(options) {
    options = options || {};

    _.extend(this, options);

    BaseView.prototype.initialize.call(this, options);

    // last selected button
    this.selected = undefined;
    this.value = undefined;
    this.$modal = undefined;

    this.tagName = 'div';

    this.el = options.el || '#modal-view';
    this.$el = $(this.el);

    this.content = this.content || '';
    if (!this.content) throw new Error('content not specified!');

    this.title = this.title || '';

    if (!this.callback) throw new Error('callback not specified!');

    this.buttonSize = this.buttonSize || '';

    this.template = this.compileTemplate(this.templateModal || templateModal);

    //style: primary, info, success, warning, danger, inverse
    this.buttons = this.buttons || {
      'Aceptar':  { style: 'primary', icon: 'ok white', value: 'ok' },
      'Cancelar': { style: '', icon: 'remove', value: 'cancel' }
    };
  },

  render: function() {

    var buttons = this.htmlButtons(this.buttons);

    var html = this.template({
      title   : this.title,
      content : this.content,
      buttons : buttons
    });

    this.$el.html(html);
    this.show();

    return this;
  },

  events: {
    'click .btn'   : 'click',
    'click .close' : 'close'
  },

  show: function() {
    this.$modal = this.$el.find('#modal-dialog');
    this.$modal.modal({ show: true, keyboard: true });
  },

  hide: function() {
    this.$modal = this.$el.find('#modal-dialog');
    this.$modal.modal('hide');
    this.undelegateEvents();
    /* la línea de abajo se eliminó para que tanto el boton 'close', el botón 'cancelar',
    *  como el click fuera del área de la ventana modal generen el mismo efecto de fade-out
    * (despalazamiento hacia arriba de la ventana previo a la eliminación del oscurecimiento)
    */
    // this.$el.html('');
    // this.destroy();
  },

  click: function(e) {
    e.preventDefault();

    var $button = $(e.currentTarget),
        label = $button.text().trim();

    this.selected = this.buttons[label];
    if (!this.selected) throw new Error( 'Could not find button with label "' + label + '"');

    this.value = this.selected.value || label;

    this.hide();

    this.callback(this.value);

  },

  close: function(e) {
    e.preventDefault();

    this.hide();

    this.selected = undefined;
    this.value = 'close';
    this.callback(this.value);
  },

  htmlButtons: function(buttons) {
    var html        = '',
        template    = undefined,
        btnClass    = '',
        iconClass   = '';

    template = _.template('' +
      '<button class="btn <%= btnClass %>">' +
      '<% if (iconClass) { %>' +
        '<i class="<%= iconClass %>"></i>' +
      '<% } %><%= label %></button>' +
      '');

    buttons = buttons || {};

    _.each(buttons, function(button, label) {
      btnClass = this.buildClass('btn', button.style);
      iconClass = this.buildClass('icon', button.icon);

      html += template({ label: label, btnClass: btnClass, iconClass: iconClass });
    }, this);

    return html;
  },

  buildClass: function(prefix, settings) {

    if (!settings.trim()) return '';

    // split in array and add prefix to each item
    var classes = _.map(settings.split(' '), function(item) {
      return prefix + '-' + item;
    });

    // join back
    return classes.join(' ');
  }

});

  return ModalView;
});
