/*globals define*/

define( [
    'lodash',
    'src/controls/BaseControl'
  ], function(
    _,
    BaseControl
  ){

'use strict';

var TextareaControl = BaseControl.extend({

  initialize: function(options) {

    options = options || {};

    _.defaults(this, options);

    this.addSupportedType('textarea');
    this.controlType = this.controlType || 'textarea';

    this.rows = this.rows || 3;

    this.controlTemplate = this.controlTemplate ||
      '<textarea class="<%= spanClass %>" id="<%= field.fullName %>" ' +
      '<%= disabled %> rows="<%= rows %>" style="resize:none">' +
      '<%= value %></textarea>';

    BaseControl.prototype.initialize.call(this, options);

  }

});

  return TextareaControl;
});
