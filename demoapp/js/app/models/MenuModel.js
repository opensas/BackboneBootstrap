/*globals define*/

define( [
    'src/models/BaseModel'

  ], function(
    BaseModel

  ) {

'use strict';

var Model = BaseModel.extend({
  idAttribute: 'MenuId',

  name:   'Menu',
  label:  'Menú',

  fields: [
    {
      name     : 'MenuId',
      type     : 'number',
      label    : 'Nro Menú',
      defaults : '',
      editable : false,
      span     : 3,
      order    : 'MenuId'
    },
    {
      name        : 'Codigo',
      type        : 'string',
      label       : 'Código',
      max         : 50,
      defaults    : '',
      span        : 3,
      order       : 'Codigo',
      help        : 'Código alfanumérico descriptivo del tipo de formato.',
      validations : [
        { method: 'required', message: 'El campo "Código" no puede estar vacío.' },
        { method: 'length' }
      ]
    },
    {
      name        : 'Tipo',
      type        : 'string',
      label       : 'Tipo',
      max         : 50,
      defaults    : '',
      span        : 3,
      order       : 'Tipo',
      control     : {
        type  : 'combo',
        items : ['menu', 'sep']
      },
      help        : 'Código alfanumérico descriptivo del tipo. menu / sep (separador).',
      validations : [
        { method: 'required', message: 'El campo "Tipo" no puede estar vacío.' },
        { method: 'length' }
      ]
    },
    //*
    {
      name        : 'MenuPadreId',
      label       : 'Menu Padre',
      type        : 'number',
      idAttribute : 'MenuId',
      showAttribute : 'Nombre',
      defaults    : null,
      span        : 3,
      help        : 'Zona a la cual pertenece la Provincia',

      comboOptions: {
        relatedId:'MenuId',
        entity:'Menu',
        field: 'MenuPadreId',
        id:'MenuId',
        endPoint:'Menu',
        value:'MenuPadreId',
        fields:['MenuPadreId','MenuId','Nombre'],
        fieldSeparators:['.',')  '],
        fieldOrder: {field:'Nombre', dir: 'asc'}
      },
        validations : [
        { method: 'required', message: 'El campo "Zona" no puede estar vacío.' }
      ],

      control     : {
        type      : 'dbcombo',
        collection : 'new MenuCollection()',
        items     : true,
        defer : true,

        toShow     : function(o) {
          return o.Descripcion + ' (' + o.Codigo + ')';
        }
      }


    },
    {
      name        : 'Orden',
      type        : 'number',
      label       : 'Orden',
      defaults    : undefined,
      span        : 2,
      order       : 'Orden',
      help        : 'Orden para Menú.',
      validations : [
        { method: 'required', message: 'El campo "Orden" no puede estar vacío.' }
      ]
    },
    {
      name        : 'Nombre',
      type        : 'string',
      label       : 'Nombre',
      max         : 500,
      defaults    : '',
      span        : 4,
      order       : 'Nombre',
      help        : 'Nombre del menú.',
      validations : [
        { method: 'required', message: 'El campo "Nombre" no puede estar vacío.' }, { method: 'length' }
      ]
    },
    {
      name        : 'Descripcion',
      type        : 'string',
      label       : 'Descripción',
      max         : 1000,
      defaults    : '',
      span        : 6,
      order       : 'Descripcion',
      help        : 'Descripción del menú.',
      validations : [
        { method: 'required' }, { method: 'length' }
      ]
    },
    {
      name        : 'Url',
      type        : 'string',
      label       : 'Url',
      max         : 500,
      defaults    : '',
      span        : 4,
      order       : 'Url',
      help        : 'Url del menú.',
      validations : [
        { method: 'required' }, { method: 'length' }
      ]
    },
    {
      name        : 'Permiso',
      type        : 'string',
      label       : 'Permiso',
      max         : 500,
      defaults    : '',
      span        : 4,
      order       : 'Permiso',
      help        : 'Permiso del menú.',
      validations : [
        { method: 'length' }
      ]
    },
    {
      name        : 'Mostrar',
      type        : 'boolean',
      label       : 'Mostrar',
      defaults    : '',
      span        : 2,
      order       : 'Mostrar',
      control     : 'sinoCombo',
      help        : 'Muestra o no el menú.',
      validations : [
        { method: 'required' }
      ]
    },
    {
      name        : 'Ayuda',
      type        : 'string',
      label       : 'Ayuda',
      max         : 500,
      defaults    : '',
      span        : 6,
      order       : 'Ayuda',
      help        : 'Ayuda del menú.',
      validations : [
        { method: 'required' }, { method: 'length' }
      ]
    }
  ],

  formFields: [
    'MenuId', 'Codigo', 'Tipo',
    'MenuPadreId',/*
    { name: 'MenuPadreId',  span: 3, label: 'Menu Padre', help: 'TODO',
    options:{entity:'Menu', field: 'MenuPadreId', id:'MenuId', endPoint:'Menu', value:'MenuPadreId',fields:'Nombre'}},

   // ,*/
    'Orden', 'Nombre',
    { name: 'Descripcion', control: 'textarea', rows: 3 },
    'Url', 'Permiso', 'Mostrar', 'Ayuda'
  ],

  queryFields: [
    { name: 'MenuId', editable: true },
    'Codigo', 'Tipo', 'MenuPadreId', 'Orden', 'Nombre', 'Descripcion', 'Url', 'Permiso', 'Ayuda', 'Mostrar'
  ],

  tableFields: [
    'MenuId', 'Codigo', 'Tipo', 'MenuPadreId', 'Orden','Nombre', 'Descripcion'
  ]

});

  return Model;
});
