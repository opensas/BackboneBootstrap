/*globals define*/

define( [
    'jquery', 'lodash', 'datepicker',
    'src/controls/InputControl'
  ], function(
    $, _, datepicker,
    InputControl
  ){

'use strict';

// see: https://github.com/eternicode/bootstrap-datepicker
// another option: http://dl.dropbox.com/u/143355/datepicker/datepicker.html
// datetime: http://www.malot.fr/bootstrap-datetimepicker/
var DateControl = InputControl.extend({

  initialize: function(options) {

    options = options || {};

    _.defaults(this, options);

    this.addSupportedType('date');
    this.controlType = this.controlType || 'date';

    if (!this.inputType) this.inputType = 'text';

    this.controlTemplate = this.controlTemplate ||
    '<div class="input-append date datepicker">' +
      '<input class="<%= spanClass %>" size="16" type="<%= inputType %>" ' +
      'value="<%= value %>" data-date-format="dd-mm-yyyy" ' +
      '<%= disabled %> id="<%= field.fullName %>">' +
      '<span class="add-on"><i class="icon-th"></i></span>' +
    '</div>';

    InputControl.prototype.initialize.call(this, options);
  },

  /**
   * Bootstrap datepicker "shadows" the change event when the user is directly
   * entering the date typing it in the input box.
   *
   * Instead we will update the field on the blur event, even if it's not a new
   * record.
   *
   * Moreover, the changeDate event will be triggered by datepicker when the
   * user selects a date using the dropdown calendar or using the arrow keys.
   *
   * @type {Object}
   *
   * See:
   *
   * - https://github.com/eternicode/bootstrap-datepicker
   * - http://stackoverflow.com/questions/15183541/bootstrap-datepicker-not-picking-change-event-on-input
   * - https://github.com/eternicode/bootstrap-datepicker/pull/295
   * - https://github.com/eternicode/bootstrap-datepicker/issues/241
   */
  events: {
    'blur :input' : function(e) { this.onUpdateField(e, true); },
    'changeDate :input' : function(e) { this.onUpdateField(e, true); }
  },

  // another way to solve the change event issue:
  // override onUpdateField to force to update the field no matter the event
  // that triggerred it
  // the date control captures change event
  // so I'll update the field on the focusout event
  //
  // onUpdateField: function(e, forceUpdate) {
  //   return InputControl.prototype.onUpdateField.call(this, e, true);
  // },

  init: function() {
    this.configureDatePicker();
  },

  afterRender: function() {

    this.$byId('#' + this.field.fullName).datepicker({
      autoclose      : true,
      todayBtn       : true,
      todayHighlight : true,
      forceParse     : false,
      language       : 'es'
    });

    //super.afterRender
    InputControl.prototype.afterRender.apply(this, arguments);
    return this;
  },

  configureDatePicker: function() {
    $.fn.datepicker.dates['es'] = {
      days: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"],
      daysShort: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
      daysMin: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"],
      months: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
      monthsShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
      today: "Hoy"
    };
  }

});

  return DateControl;
});
