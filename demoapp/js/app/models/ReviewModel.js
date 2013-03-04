/*globals define*/

define( [
    'src/models/BaseModel',
    'app/models/WineCollection',
    'src/utils/convert'
  ], function(
    BaseModel,
    WineCollection,
    convert
  ) {

'use strict';

var Model = BaseModel.extend({

  idAttribute: 'id',

  name:   'Review',

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
      name              : 'wine',
      label             : 'Wine',
      type              : 'object',
      idAttribute       : 'id',
      displayAttribute  : 'name',
      defaults          : null,
      span              : 3,
      help              : 'Wine of the review',
      validations       : 'required',
      control     : {
        type       : 'CollectionCombo',
        collection : new WineCollection(),
        display    : function(attrs) {
          return attrs.name + ' (' + attrs.code + ')';
        }
      }
    },
    {
      name     : 'author',
      type     : 'string',
      label    : 'Author',
      max      : 50,
      defaults : '',
      span     : 3,
      order    : 'name',
      help     : 'Enter the author\'s name',
      validations: ['required', 'length']
    },
    {
      name     : 'text',
      type     : 'string',
      label    : 'Content',
      min      : 10,
      max      : 100,
      defaults : '',
      span     : 3,
      order    : 'text',
      help     : 'Enter the review',
      validations: ['required', 'length']
    },
    {
      name        : 'date',
      type        : 'date',
      label       : 'Publish date',
      span        : 3,
      order       : 'date',
      format      : 'DD-MM-YYYY',
      help        : 'Enter the date of the review (dd-mm-yyyy)',
      control     : 'date',
      validations : ['required', 'format']
    }

  ],

  formFields: [
    'id',
    'wine',
    'author',
    { name: 'text', control: 'textarea', rows: 4, span: 6 },
    'date'
  ],

  headerFields: [
    'id',
    'wine',
    'author'
  ],

  queryFields: [
    'id',
    'wine',
    'author',
    'text',
    { name: 'date', control: 'input' }
  ],

  tableFields: ['id', 'wine', 'author', 'date']

});

  return Model;
});
