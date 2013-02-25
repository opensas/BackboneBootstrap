/*globals define, app*/

define( [
    'lodash',
    'src/controls/modal/ModalView'
  ], function(
    _,
    ModalView
  ) {

'use strict';

var modal = {};

modal.render = function(options) {

  var newCallback, callback;

  callback = options.callback;
  delete options.callback;

  if (callback) {
    newCallback = function(value) {
      if (value === 'ok') { callback(); }
    };
  } else {
    newCallback = function() {};
  }

  options = _.defaults(options, {
    title: '',
    content: '',
    callback: newCallback,
    buttons: {
      'Aceptar':  { style: 'primary', icon: 'ok white', value: 'ok' }
    },
    controller : app.controller
  });

  if (!options.content)  { throw new Error('content not specified'); }

  new ModalView(options).render();

};

modal.error = function(content, callback) {
  modal.render({ title: '¡Error!', content: content, callback: callback });
};

modal.message = function(content, callback) {
  modal.render({ title: '', content: content, callback: callback });
};

modal.confirm = function(content, callback) {
  modal.render({ title: 'Confirmación', content: content, callback: callback });
};

modal.confirmDelete = function(content, callback) {

  // just received a callback with no content
  if (_.isFunction(content)) {
    callback = content;
    content = undefined;
  }

  var buttons = {
    'Cancelar':  { style: '', icon: '', value: 'cancel' },
    'Eliminar':  { style: 'danger', icon: 'remove white', value: 'ok' }
  };

  content = content || '<h4>¿Está seguro que desea eliminar el registro actual?</h4>';

  modal.render({title: '¡Atención!', content: content, callback: callback, buttons: buttons});
};

  return modal;
});
