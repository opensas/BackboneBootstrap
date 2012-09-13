/*globals define*/
'use strict';

define(
  ['backbone'],
  function(Backbone) {

var BaseModel = Backbone.Model.extend({

/**
 * Array of field definition to be displayed in edit mode
 * This information is used by utils.crud.generateFormTemplate
 * to automatically generate a template for form edition
 * example: formFields: [
 *   {field: 'id', readOnly: true, label: 'Id', help: 'Automatically generated' },
 *   {field: 'name', span: 6, label: 'Name', help: 'Enter your name' },
 *   {field: 'comment', span: 8, label: 'Comment', help: 'Enter your comment', control: 'textarea', rows: 4 }
 *   ...
 * ]
 */
  formFields: undefined
});

  return BaseModel;
});