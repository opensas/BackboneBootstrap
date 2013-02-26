/*globals define*/

define( [
    'src/models/BaseModel',
    'app/models/CountryCollection',
    'src/utils/convert'
  ], function(
    BaseModel,
    CountryCollection,
    convert
  ) {

'use strict';

var Model = BaseModel.extend({

  idAttribute: 'id',

  name:   'Wine',
  label:  'Wine',

  fields: [
    {
      name     : 'id',
      type     : 'number',
      label    : 'Id',
      defaults : '(new)',
      editable : false,
      span     : 2,
      order    : 'id'
    },
    {
      name     : 'name',
      type     : 'string',
      label    : 'Name',
      max      : 50,
      defaults : '',
      span     : 3,
      order    : 'name',
      help     : 'Enter the name of the wine',
      validations: [
        { method: 'required', message: 'The field wine cannot be empty.' },
        { method: 'length' }
      ]
    },
    {
      name     : 'year',
      type     : 'string',
      label    : 'Year',
      defaults : (new Date().getFullYear()).toString(),
      span     : 3,
      order    : 'year',
      help     : 'Enter the year of the wine',
      validations: [
        { method: 'required', message: 'The year of the wine cannot be empty.' },
        { method: 'range',
          greater: '1900',
          'lessEqual': (new Date().getFullYear()).toString()
        }
      ]
    },
    {
      name     : 'grapes',
      type     : 'string',
      label    : 'Grapes',
      max      : 50,
      defaults : '',
      span     : 3,
      order    : 'grapes',
      help     : 'Enter the grapes of the wine',
      validations: [
        { method: 'length' }
      ]
    },
    {
      name              : 'country',
      label             : 'Country',
      type              : 'object',
      idAttribute       : 'id',
      displayAttribute  : 'name',
      defaults          : null,
      span              : 3,
      help              : 'Country of the wine',
      validations       : [
        { method: 'required', message: 'You have to specify the country.' }
      ],
      control     : {
        type       : 'CollectionCombo',
        collection : new CountryCollection(),
        display    : function(attrs) {
          return attrs.name + ' (' + attrs.code + ')';
        }
      }
    },
    {
      name        : 'region',
      type        : 'string',
      label       : 'Region',
      max         : 1000,
      defaults    : '',
      span        : 6,
      order       : 'region',
      help        : 'Nombre de la Provincia',
      validations : [
        { method:'required' }, { method: 'length' }
      ]
    },
    {
      name        : 'description',
      type        : 'string',
      label       : 'Description',
      max         : 1000,
      defaults    : '',
      span        : 6,
      order       : 'description',
      help        : 'Wine\'s description',
      validations : [
        { method:'required' }, { method: 'length' }
      ]
    }
  ],

  formFields: [
    'id',
    'name',
    'year',
    'grapes',
    'country',
    'region',
    { name: 'description', control: 'textarea', rows: 4 }
  ],

  headerFields: [
    'id',
    { name: 'name',   span: 4 },
    { name: 'grapes', span: 7 }
  ],

  queryFields: [
    { name: 'id', defaults: '', editable: true },
    'name',
    { name: 'year', defaults: '' },
    'grapes',
    'region',
    { name: 'description', control: 'textarea', rows: 4 }
  ],

  tableFields: ['id', 'name', 'year', 'country', 'region']

});

  return Model;
});
