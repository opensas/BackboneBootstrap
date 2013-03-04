/*globals define, console*/

define( [
    'jquery', 'lodash',
    'src/controls/ComboControl'
  ], function(
    $, _,
    ComboControl
  ){

'use strict';

var CollectionComboControl = ComboControl.extend({

  initialize: function(options) {

    options = options || {};

    _.bindAll(this, 'updateItems');

    _.defaults(this, options);

    this.addSupportedType('collectioncombo');
    this.controlType = this.controlType || 'collectioncombo';

    this.items = { '' : '--cargando opciones--' };

    if (!this.collection) throw new Error('items source collection not specified');

    // if value and description are equal
    // use control.field to set both at the same time
    if (this.field) this.fieldValue = this.fieldDescription = this.field;

    if (!this.fieldValue) throw new Error('fieldValue not specified');
    if (!this.fieldDescription) throw new Error('fieldDescription not specified');

    this.showSelectItem = (this.showSelectItem === undefined ? true : this.showSelectItem);

    ComboControl.prototype.initialize.call(this, options);

    this.fetched = false;

    if (this.collection.length > 0) {
      this.fetched = true;
      this.loadItems();
    }

  },

  loadItems: function(collection) {
    var items   = {},
        display = this.display || this.field.displayAttribute;

    // helper function to retrieve the value of a property
    // or the evaluation of a function
    var readProp = function(attrs, propExpression) {
      return _.isFunction(propExpression) ? propExpression(attrs) : attrs[propExpression];
    };

    if (this.showSelectItem) {
      items[''] = '--seleccione un ítem--';
    }

    _.each(this.collection.models, function(model) {
      var attrs       = model.attributes,
          value       = readProp(attrs, this.field.idAttribute),
          description = readProp(attrs, display);

      items[value] = description;
    }, this);

    this.items = items;
    return this;
  },

  init: function() {
    this.collection.on('reset', this.updateItems, this);
    this.collection.on('change', this.updateItems, this);

    if (this.fetched) this.loadItems();
    else              this.collection.fetch();
  },

  updateItems: function() {
    this.fetched = true;
    this.loadItems().render();
    return this;
  },

  render: function() {
    ComboControl.prototype.render.call(this);
    return this;
  }

});

  return CollectionComboControl;
});
