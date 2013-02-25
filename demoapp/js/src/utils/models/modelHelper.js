/*globals define*/

define( [
    'lodash',
    'src/utils/models/fieldHelper',
    'src/utils/models/FieldCollection'
  ], function(
    _,
    fieldHelper,
    FieldCollection
  ) {

'use strict';

var modelHelper = {};

/**
 * Helper functions to load the fields information.
 *
 */

/*
 * Get the default value from each field and
 * generates the defaults object as expected by Backbone
 *
 * @param     {fields} a collection of field definition, with default values
 *
 * @return    the defaults object as expected by Backbone
 *
 * Example:
 *
 * var fields = {
 *  code: {
 *    'type':'String',
 *     default: 'new code'
 *   },
 *   name: {
 *     'type':'String',
 *     default: 'new name'
 *   },
 *   'description: {
 *     'type':'String'
 *   }
 * }
 *
 * modelHelper.defaults(fields) ->
 *
 * defaults: {
 *   code: 'new code',
 *   name: 'new name'
 * }
 *
 */

modelHelper.defaultsFromFields = function(fields) {
  var defaults = {};

  for(var field in fields) {
    if (_.has(field, 'defaults')) defaults[field.name] = field.defaults;
  }

  return defaults;
};

modelHelper.completeModelDefaults = function(Model) {
  var fields    = Model.prototype.fields || new FieldCollection(),
      defaults  = Model.prototype.defaults || {};

  // var defaultsFromFields = modelHelper.defaultsFromFields(fields);
  var defaultsFromFields = fields.defaults();

  Model.prototype.defaults = _.extend(_.clone(defaults), defaultsFromFields);
};

/**
 * Takes an array of fields definitions and completes it
 * with the original fields array definition
 *
 * @param  {Array<fieldDefinition>} baseFields The complete fields definition as an object
 * @param  {Array<fieldDefinition>} fields     Array of field definition to override the original definition
 * @return {Array<fieldDefinition>}            An array of field definition enriched with the info from fieldsObject
 *
 * Every Model should have a fields array describing the fields of the model.
 *
 * For example. the following fields object defines three fields:
 *
 *  fields: [
 *    { name:       'ProvinciaId',
 *      type:       'number',
 *      label:      'Nro Provincia',
 *      defaults:   '(nuevo)',
 *      readOnly:   true,
 *      order:      'ProvinciaId'
 *    },
 *    { name:       'Codigo',
 *      type:       'string',
 *      label:      'Código',
 *      max:        50,
 *      order:      'Codigo'
 *    },
 *    { name:       'Descripcion',
 *      type:       'string',
 *      label:      'Descripción',
 *      max:        500,
 *      order:      'Descripcion'
 *    }
 *  }
 *
 * A model can also define a set of fields to use for other purposes,
 * like the following:
 *
 * formFields:    fields to be used for the edit and add form
 * queryFields:   fields for the query form
 * headerFields:  fields to be used on the parent header part of a parent-child form
 * tableFields:   field to be used to display the records in a grid
 *
 * When defining these set of fields, you can pass an array to override the
 * original fields definition, effectively using the fields property as defaults
 *
 * For example:
 *
 *  // When editing use a textarea instead of an input for the Descripcion
 *  formFields: [ 'ProvinciaId', 'ZonaId', 'Codigo',
 *    { field: 'Descripcion', control: 'textarea', rows: 4 }
 *  ],
 *
 *  // Do not show ProvinciaId field in the parent header
 *  headerFields: [
 *    { name: 'Codigo',      span: 4 },
 *    { name: 'Descripcion', span: 7 }
 *  ],
 *
 *  // When filtering ProvinciaId is editable and defaults to ''
 *  queryFields: [
 *    { name: 'ProvinciaId', defaults: '', readOnly: false },
 *    'Codigo', 'Descripcion'
 *  ],
 *
 *  // Nothing new, just show the three fields in table View
 *  tableFields: ['ProvinciaId', 'Codigo', 'Descripcion']
 *
 */
modelHelper.completeFieldDefinition = function(baseFields, fields) {
  var completedFields = [];

  _.each(fields, function(field) {

    var baseField, completedField;

    // instead of an object, it might have specified just the fieldName as a string
    // tansform it into an object
    if (_.isString(field)) field = { name: field };

    if (!field.name) throw new TypeError('field.name not specified');

    baseField = _.where(baseFields, { name: field.name });

    if (baseField.length === 0) {
      throw new TypeError('field "' + field.name + '" not found in fields collection');
    } else {
      baseField = _.clone(baseField[0]);
    }

    completedField = _.defaults(_.clone(field), baseField);
    completedFields.push(completedField);
  });

  return completedFields;
};

modelHelper.completeModelFieldsDefinitions = function(Model) {
  var fieldsDefinitions = ['fields', 'formFields', 'queryFields', 'headerFields', 'tableFields'],
      proto             = Model.prototype,
      baseFields        = proto.fields;

  // process each field collection of the model (formFields, queryFields, headerFields, tableFields)
  _.each(fieldsDefinitions, function(fieldDefinition) {
    var toCompleteFields = proto[fieldDefinition],
        completedFields;

    if (toCompleteFields) {
      // first, complete fieldsDefinition with the info from Model.fields
      completedFields = modelHelper.completeFieldDefinition(
        baseFields, toCompleteFields
      );
      // then instantiate fields
      completedFields = _.map(completedFields, function(field) {
        return fieldHelper.createField(field);
      });

      // update the field definition of the prototype with the instantiated fields
      proto[fieldDefinition] = new FieldCollection(completedFields);
    }
  });
};

/*
 * Read the information from the fields object
 * and uses it to enhance the following objects:
 *
 * defaults:      read the default value from each field
 *                and updates Backbone defautls
 *
 * formFields:    field definition to use for update forms
 * queryfields:   field definition to use for query form
 * headerFields:  field definition to use for Parent header panel
 * tableFields:   field definition to use to display the grid
 *
 * completes the fields definition with the info from the fields
 *
 * @param     {Object} Model  The contructor of the model to enhance
 *
 * @return    {Object} Model  The enhanced Model
 */
modelHelper.enhanceModelFields = function(Model) {
  modelHelper.completeModelFieldsDefinitions(Model);
  modelHelper.completeModelDefaults(Model);
  return Model;
};

  return modelHelper;
});
