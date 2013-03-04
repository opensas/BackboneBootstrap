/*globals define*/

define( [
    'lodash',
    'src/controls/BaseControl'
  ], function(
    _,
    BaseControl
  ){

'use strict';

var InputControl = BaseControl.extend({

  initialize: function(options) {

    options = options || {};

    _.defaults(this, options);

    this.addSupportedType('input');
    this.controlType = this.controlType || 'input';

    if (!this.inputType) this.inputType = 'text';

    this.controlTemplate = this.controlTemplate ||
      '<input type="<%= inputType %>" class="<%= spanClass %>" ' +
      '<%= disabled %> id="<%= field.fullName %>" ' +
      'value="<%= value %>" />';

    BaseControl.prototype.initialize.call(this, options);

  }

});

  return InputControl;
});
