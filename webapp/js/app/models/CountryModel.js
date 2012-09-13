/*globals define*/
'use strict';

define(
  ['backbone', 'src/models/BaseModel'],
  function(Backbone, BaseModel) {

var CountryModel = BaseModel.extend({
  defaults: {
    'id'          : null,
    'code'        : 'NN',
    'name'        : 'new country'
  },
  formFields: [
    { field: 'id', readOnly: true, label: 'Id', help: 'Automatically generated', control: 'id' },
    { field: 'code',        span: 6, label: 'Code',         help: 'Enter the code of the country' },
    { field: 'name',        span: 6, label: 'Name',         help: 'Enter the name of the country' },
  ]
});

  return CountryModel;
});