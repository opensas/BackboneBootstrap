/*globals define*/

define( [
    'lodash',
    'src/controls/BaseControl',
    'text!./combo.html'
  ], function(
    _,
    BaseControl,
    comboTemplate
  ){

'use strict';

var ComboControl = BaseControl.extend({

  initialize: function(options) {

    options = options || {};

    _.defaults(this, options);

    this.addSupportedType('combo');
    this.controlType = this.controlType || 'combo';

    if (!this.items) throw new Error('combo items not specified');

    if (_.isArray(this.items)) this.items = this.toItems(this.items);

    this.controlTemplate = this.controlTemplate || comboTemplate;

    BaseControl.prototype.initialize.call(this, options);

  },

  toItems: function(arrayItems) {
    var ret = {};
    _.each(arrayItems, function(item) {
      ret[item] = item;
    });
    return ret;
  }

});

  return ComboControl;
});
