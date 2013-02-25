/*globals define*/

define( [
    'src/models/BaseModel',
    'src/utils/convert'
  ], function(
    BaseModel,
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
      name     : 'code',
      type     : 'string',
      label    : 'Code',
      max      : 10,
      defaults : '',
      span     : 3,
      order    : 'code',
      help     : 'Enter the code of the country',
      validations: [
        { method: 'required', message: 'The code of the country cannot be empty.' },
        { method: 'length' }
      ]
    },
    {
      name     : 'name',
      type     : 'string',
      label    : 'Name',
      max      : 50,
      defaults : '',
      span     : 3,
      order    : 'name',
      help     : 'Enter the name of the country',
      validations: [
        { method: 'required', message: 'The name of the country cannot be empty.' },
        { method: 'length' }
      ]
    }
  ],

  formFields: ['id', 'code', 'name'],

  queryFields: [
    { name: 'id', defaults: '', editable: true },
    'code', 'name'
  ],

  tableFields: ['id', 'code', 'name']

});

  return Model;
});
