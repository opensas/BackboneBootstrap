/*globals define, console*/

// NotificationManager
// Este manager se encargara de gestionar todas las notificaciones del sistema.
//

define( [
    'jquery', 'lodash', 'gritter', 'src/utils/html'
  ], function(
    $ , _, popUpNotification, html
  ) {

'use strict';

var notificationManager = {

  defaults: {
    message        : '',
    position       : 'top-right',
    fade_in_speed  : 'medium',
    fade_out_speed : 'medium',
    time           : 2000
  },

  initialize: function(options){
    this.elMessage = options.elMessage;
    if (this.elMessage) this.$elMessage = $(this.elMessage);

    _.defaults(this, this.defaults);

    $.extend($.gritter.options, {
      position       : this.position,       // 'top-right' but can be 'bottom-left', 'bottom-right', 'top-left', 'top-right'
      fade_in_speed  : this.fade_in_speed,  // string or int
      fade_out_speed : this.fade_out_speed, // string or int
      time           : this.time
    });
  },

  update: function(message, type) {
    var title, image;

    // verifico que tipo de mensaje debo mostrar
    switch (type) {

    case 'error':
      title = 'Error:';
      image = './img/Error.png';
      break;

    case 'success':
      title  = 'Exito:';
      image ='./img/ok.png';
      break;

    case 'info':
      title = 'Información:';
      image = './img/Information.png';
      break;

    case 'warning':
      title = 'Alerta:';
      image = './img/alert.png';
      break;

    default:
      title = 'Alerta:';
      image = './img/alert.png';
    }

    $.gritter.add({
      title:  html.encode(title),
      text:   html.encode(message),
      image:  image
    });

  },

  addNotification: function(message, type) {
    this.update(message, type);
  },

  removeNotification: function(){
    $.gritter.removeAll();
  }

};

  return notificationManager;
});
