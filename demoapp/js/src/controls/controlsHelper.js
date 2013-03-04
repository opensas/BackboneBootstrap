/*globals define*/

define( [
    'lodash',
    'src/controls/BaseControl',
    'src/controls/InputControl',
    'src/controls/DateControl',
    'src/controls/TextareaControl',
    'src/controls/ComboControl',
    'src/controls/SiNoComboControl',
    'src/controls/CollectionComboControl',
    'src/controls/DBComboControl'
  ], function(
    _,
    BaseControl,
    InputControl,
    DateControl,
    TextareaControl,
    ComboControl,
    SiNoComboControl,
    CollectionComboControl,
    DBComboControl
  ) {

'use strict';

var controlsHelper = {};

/**
 * Creates a control instance from a field definition.
 *
 * It checks for field.control to discover the type of control to create.
 *
 * The control constructor receives the field definition itself as parameter
 * plus a reference to the model.
 *
 * Supported controls: input, textarea
 *
 * @param     {field} field definition.
 *
 * @return    returns a new instance of the correspoding control
 *
 */
controlsHelper.createFromField = function(field, model) {

  field = field || {};

  var control = field.control || 'input';

  // already an instantiated control
  if (control instanceof BaseControl) return control;

  // the control instance has already been created
  if (!_.isString(control)) {
    throw new Error('control should be an instance of BaseControl or a string with the type of control.');
  }

  // check for a supported control type
  var ControlConstructor = controlsHelper.constructors[control.toLowerCase()];
  if (!ControlConstructor) throw new Error('control of type "' + control + '" not supported.');

  // add model to the constructor parameters
  var options = _.clone(field);
  options.model = model;

  return new ControlConstructor(options);
};

controlsHelper.createControl = function(options, extraOptions) {

  options = options || {};

  // specified the control type as a string
  // transform it into an object
  if (_.isString(options)) options = { type: options };

  // passed extraOptions, overwrite those from options
  // it's used to pass the field of the control
  if (extraOptions) _.extend(options, extraOptions);

  // received an already instantiared control, just return it
  if (options instanceof BaseControl) return options;

  var type = options.type || 'input';

  if (!_.isString(type)) throw new Error('control.type should be a string.');

  // check for a supported control type
  var ControlConstructor = controlsHelper.constructors[type.toLowerCase()];

  if (!ControlConstructor) throw new Error('control of type "' + type + '" not supported.');

  return new ControlConstructor(options);

};

controlsHelper.constructors = {
  input           : InputControl,
  date            : DateControl,
  textarea        : TextareaControl,
  combo           : ComboControl,
  sinocombo       : SiNoComboControl,
  collectioncombo : CollectionComboControl,
  dbcombo         : DBComboControl
};

  return controlsHelper;
});
