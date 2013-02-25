/*globals define,app,console*/

define( [
    'jquery','jqueryui', 'lodash', 'src/views/BaseView',
    'src/utils/crud', 'src/utils/html',
    'text!src/views/crud/fileUploader.html'
  ], function(
    $, jui, _, BaseView,
    crud, html, fileUploaderTemplate
  ) {

'use strict';

var FileUploadView = BaseView.extend({

  resource: undefined,

  title: '',

  template: _.template(fileUploaderTemplate),

  events: {'click': 'save'},

  initialize: function(options) {
    options = options || {};
    BaseView.prototype.initialize.call(this, options);
    _.bindAll(this, 'save');

    // console.log('FileUploadView.initialize I am alive!!');
  },

  render: function() {

    this.template = _.template(fileUploaderTemplate);

    this.$el.html(this.template( {codigo: 'asdasdasd'} ));

    return this;
  },

  save: function() {
    console.log(this.$el.serializeArray());

    // if (this.preSave()) {
    //   var attrs = crud.getAttrs(this.model, this.$el);

    //   crud.saveModel(
    //     attrs, this.model, this.collection,
    //     function(){alert("text");}, this.error
    //   );
    // } else {
    //   this.controller.error('El formulario contiene errores. Revise la informaación ingresada.');
    // }
  }

});

  return FileUploadView;
});
