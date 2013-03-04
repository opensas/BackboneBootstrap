/*globals define*/

define( [
    'lodash',
    'src/utils/models/Field',
    'src/utils/convert'
  ], function(
    _,
    Field,
    convert
  ){

'use strict';

/**
   A field that can handle nested objects.

   @class ObjectField
   @extend Field
   @constructor
*/
var DateField = Field.extend({

  initialize: function(options) {

    _.defaults(this, options || {});

    this._addSupportedType('date');

    this.type = this.type || 'date';

    // assign default display handler
    if (!this.display) {
      this.display = function(val, attrs, field) {
        return convert.formatDate(val, field.format);
      };
    }

    Field.prototype.initialize.call(this, options);
  },

  /**
   * Adds the default value (null) for date object
   *
   * @param {string} type   Should be equal to date,
   *                        otherwise it will be handled by super._setDefaults
   *
   * @override
   *
   */
  _setDefaults: function(type) {

    if (type.toLowerCase() === 'date') return null;

    // super.setDefaults
    return Field.prototype.setDefaults.call(this, type);
  }

});

  return DateField;
});
