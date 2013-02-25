/*globals define*/

define( [
    'lodash',
    'src/controls/ComboControl',
    'text!src/controls/combo.html'
  ], function(
    _,
    ComboControl,
    comboTemplate
  ){

'use strict';

var SiNoComboControl = ComboControl.extend({

  initialize: function(options) {

    options = options || {};

    _.defaults(this, options);

    this.addSupportedType('sinocombo');
    this.controlType = this.controlType || 'sinocombo';

    this.items = this.items || {
      '' : '--seleccione una opción--',
      '1'  : 'Sí',
      '0'  : 'No'
    };

    if (_.isArray(this.items)) this.items = this.toItems(this.items);

    this.metaTemplate = this.metaTemplate || comboTemplate;

    ComboControl.prototype.initialize.call(this, options);

  }

});

  return SiNoComboControl;
});
