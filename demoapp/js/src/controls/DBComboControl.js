/*globals define*/

define( [
    'jquery', 'lodash',
    'src/controls/BaseControl',
    'lib/select2', 'src/controls/selectTable',
    'text!src/controls/dbcombo.html'
  ], function(
    $, _,
    BaseControl,
    select, selectTable,
    dbComboTemplate
  ){

'use strict';

/**
  Este control, se encarga de listar entidades que persisten en BBDD, paginando
  la cantidad de items que despliega, y permitiendo el filtrado por matcheo de
  texto ingresado.

  Al cambiar de valor, en el caso de actualización de una entidad ya creada, se
  encarga de impactar el cambio dentro del atributo del modelo al que refiere.

  Valores obligatorios que deben estar presentes en el objeto comboOptions
  definido en el atributo del modelo que requiere de un DBComboControl. Los
  valores, aparentemente, repetidos fueron incluidos por los siguientes
  factores:

  1.- El atributo 'value' del nodo 'input#entidadID' es abusado entre la función
    doRender y el pluggin.

    doRender, lo toma para obtener el nombre de la FK, y el pluggin como
    indicador de la entidad seleccionada (el valor de FK).

    TODO: Esta dualidad es una incosistencia de diseño, que sería bueno
    cambiarla, pero por razones de tiempo no lo haré)

    Debido a lo anterior, el nombre de la FK aparece dos veces.

  2.- En casos como el inner join de menu.MenuPadreiD con menu.MenuId, deben
    indicarse tanto el nombre de la FK, como el de la PK de la entidad
    relacionada, y luego para fijar el valor que tomará la FK.
    Menu.MenuPadreId = MenuJoineado.MenuId.

  3.- Algunas FKs guardan el valor numérico de la entidad relacionada como
    Menu.MenuPadreId, mientras que en otros casos guarda toda la entidad como el
    caso de ActividadAFIP.TipoActividadAFIP, en este atributo, se indica la
    entidad relacionada, pero no su PK.

  comboOptions: {
    relatedId:  nombre de la Key de la entidad foránea que se tomará para
                actualizar el valor de la FK de la entidad en edición
                (MenuEnEdicion.MenuPadreId = MenuJoineado.MenuId), este caso,
                indicará 'MenuId'.
                (ActividadAFIPEnEdicion.TipoActividadAFIP.TipoActividadAFIPId =
                TipoActividadAFIP.TipoActividadAFIPId), en este otro caso será
                'TipoActividadAFIPId'

    entity:     entidad que será listada

    field:      nombre de la FK, a veces, refiere al nombre de la FK, y otras al
                nombre de la entidad de la FK, dependiendo de la definición de
                los campos del modelo.

    id:         Representa el nombre de la Key que usará el pluggin como
                indicador de la entidad seleccionada en el combo, siempre tendrá
                el nombre del atributo de modelo que permita fijar cual de las
                entidades listadas es la seleccionada. Se emplea en el caso de
                las FK que almacenan al object entero, para discrinar su key, o
                como el nombre de las FKs como en el caso de Menu.MenuPadreId.

    endPoint:   subdirectorio para generar el url de los ajax's

    value:      Nombre del campo que se está joineando (este atributo es el
                inconsistente)

    fields:     campos que se listaran en los items del combo
  }
  */
var  DBComboControl = BaseControl.extend({

  exclusion: false,

  initialize: function(options) {

    options = options || {};

    this.controlType = 'dbcombo';

    // seteo de atributos para completar el template (del combo y del container)
    options.span = options.span || '4';
    this.span = options.span;
    options.spanClass = options.spanClass || 'span4';
    this.spanClass = options.spanClass;
    this.inputID = options.spanClass;
    this.divClass = options.divClass || 'container';
    this.inputClass = options.inputClass || 'bigdrop';

    _.defaults(this, options);

    this.addSupportedType('dbcombo');

    if (!options.field.comboOptions) throw new TypeError('field.comboOptions not specified');

    this.controlTemplate = this.metaTemplate || dbComboTemplate;

    this.jqField = this.getSelectContainer();

    BaseControl.prototype.initialize.call(this, options.field.comboOptions);
  },

  /**
    Recibe el nodo interno al pluggin select2 (no disponible durante la
    creación, ni inicialización, se genera dinámicamente por select2).
    Este es el nodo que dispara el blur del pluggin.
    En esta función se disparará el blur sobre el input#entidadID para
    actualizar el estado del modelo.
  */
  _blur: function(o){
    var jqTarget  = $('input.bigdrop[type="hidden"]', o.parentNode.parentNode),
        value     = jqTarget.data().select2.data(),
        id        = jqTarget.attr('id'),
        relatedId = '',
        change    = {},
        keyValue  = id,
        val       = this.model.get(keyValue);

    if (val instanceof Object)      // cuando la FK es el objeto relacionado, y no (como en
      change[id] = value;           // menu.MenuPadreId solo el valor numérico) se cambia todo
    else {                          // el objeto, sino solo su valor
      relatedId  = jqTarget.attr('relatedId'),
      change[id] = value[relatedId];
    }
    this.model.set(change);

    //
    BaseControl.prototype._updateField.call(this,this.getSelectContainer()[0]);
  },

  /**
    TODO: funcionalidad incompleta, recibe un booleano indicando si debe o no excluirse
    entidades de la collection que llena el combo
  */
  selfExclude: function(value){
    this.exclusion=value;
  },

  /**
    Por ahora solo se encarga en llamar al init de la clase base
  */
  init: function() {
    return BaseControl.prototype.init.apply(this, arguments);
  },

  /**
    Retorna el jquery del nodo HTML input#entidadID
  */
  getSelectContainer: function(){
    return $('input.bigdrop[type=hidden]');
  },

  render: function(){
    // renderizado del template del contenedor y dbcombo.html
    BaseControl.prototype.render.call(this);

    //
    var options   = this.field.comboOptions,
        jqField   = this.getSelectContainer(),  // input#entidadId
        keyValue  = options.value,              // nombre de la FK de la entidad principal
        val       = this.model.get(keyValue);   // valor de la FK (puede ser el objeto relacionado
                                                // o el valor del id de la entidad relacionada
    if (val instanceof Object) {
      val = val[options.id];            // cuando el valor de la FK es el objeto, se reemplaza
    }                                   // por su id

    jqField.attr('value',val);    // se asigna el valor del id de la FK en el nodo, para ser leído
                                  // por el pluggin select2 con el que setea la entidad seleccionada
    this.jqField=jqField;

/* TODO: funcionalidad incompleta.
  La exclusión de entidades de la collection que llena el combo, tiene la finalidad de, precisamente,
  llevar a cabo dicha tarea. Por ejemplo, cuando se trata del combo menu.MenuPadreId, en éste, no
  pueden listarse como opciones válidas, cualquier entidad igual a la que se halle en edición, así
  como las que integran el subárbol que cualgan de ella, dado que generaría recursividad y destruiría
  el menu.
*/
    if (this.exclusion)
      options.exclusion = '|'+options.id+';!=;'+this.model.get(options.id)+'|'+keyValue+';!=;'+val;

    // método que controla la creación y pintado del pluggin
    this.doRender(jqField,options);

    // se agrega al closure para estar disponible en contextos como el de _blur
    var _this=this;

    // se toma el blur del nodo 'a.select2-choice' para disparar el blur del input#entidadID
    // evento que se espera en el BaseControl para refrescar el valor del atributo en el modelo
    $(this.el).on(
      "blur",
      "a.select2-choice",
      function (){
        _this._blur(this);
      }
    );

    return this;
  },

  /**
    Recibe el jquery del nodo input#entidadID o de ser null lo obtiene del objeto,
    el segundo parámetro es el objeto con los valores seteados en comboOptions, atributo
    del modelo de la entidad que lista, si no se envía este parámetro lo toma del objeto
  */
  doRender: function(jqField,options){

    if (!jqField)
      jqField = this.getSelectContainer();

    if (!options) options = this.options;

    var f_ = options.fields,                  // vector de campos a incluir en los items del combo
        fs_ = options.fieldSeparators,        // vector de separadores (en caso de ser todos los mismos, puede ser
                                              // solo un string
        o_  = options.fieldOrder,
        ep_ = options.endPoint,               // endpoint de la entidad listada
        en_ = options.entity,                 // clase de la entidad listada
        id_ = this.model.get(options.value),  // valor de la FK
        exclusion = options.exclusion || '',  // TODO: incompleto
        lastQuery={page:0,term:null};         // objeto usado por el cache de consultas


    if (!_.isArray(f_)) {    // los campos a listar se convierten en array de no serlo
      f_ = [f_];
    }

    if (!fs_) fs_=' ';
    if (!(fs_ instanceof Array)) {
      var sep = fs_;
      fs_=[];
      for (var i=0; i<f_.length-1; ++i)
        fs_.push(sep);
    }

    if (!o_) o_={field:f_[0], dir:'asc'};

    $(function() {
      /**
        Función que será invocada por select2 para el pintado de cada item dentro del combo
      */
      // var formatResult = function(entity) {
        // var markup = "<table  class='movie-result'><tr>";
        // markup += "<td class='country-code'>" + formatSelection(entity) + "</td>";
        // markup += "</tr></table>"
      // return markup;
    // };

    // /**

    // */
    // var formatSelection = function(entity) {
      // if (entity && entity[f_[0]])
        // return entity[f_[0]];

      // return "";
    // }

      var formatResult = function(entity) {
      var markup =  "<table cellspacing='3px' cellspacing='4px' style='padding:5px;' class='movie-result db-select'>" +
                      "<tbody>"+
                        "<tr>" +
                        // "<td class='country-code'>" +
                          formatSelection(entity,'table') +
                        // "</td>" +
                      "</tr>" +
                        "</thody>"+
                    "</table>";
      return markup;
    };

    var formatSelection = function(entity,format) {
      var result='',
          r=[];
      var begin='', end='', between=end+begin;

      if (format && format==='table') {
        begin='<td>';
        end='</td>';
        between=end+begin;
      }

      for (var i=0; i<f_.length; ++i)
        if (entity && entity[f_[i]]) {
          r.push(entity[f_[i]]);
          if (fs_.length > 1 && i<fs_.length) {
            r.push(fs_[i]);
          }
        }

      if (r.length == 1)
        result = r[0];
      else {
        result = r.join(between);
      }
    return begin+result+end;

  };

    /**
      método que generará el url a donde apuntar los ajax's
    */
    var inferEndpoint = function() {
      return window.location.protocol+'//'+window.location.host +'/'+ ep_;
    };

    var ajax = {
      url: inferEndpoint(),
      len: 10,                // cantidad de items a buscar
      term: '',
      timeout: undefined,     // current scheduled but not yet executed request
      requestSequence: 0,     // sequence used to drop out-of-order responses
      quietMillis: 300,
      results:{}              // objeto que se usará para mantener el cache de consultas
    };

    var action='load';        // usado para el cache, puede tomar los valores:
                              // load, reload, filtration, pagination
    var filterContext=null;

    // invocación al pluggin p0ara la instanciación del select2
    jqField.select2({

     placeholder: '',
      minimunInputLenght: 2,
      action:'load',
      'formatResult':     formatResult,
      'formatSelection':  formatSelection,
      allowClear:         true,
      dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller

      // función que será invocada por el pluggin para las consultas a BBDD
      query: function(options) {

        if (typeof(lastQuery.page)=='undefined')
          lastQuery.page=0;       // inicialización para el cache de consultas

          if (options.term!=lastQuery.term) { // ante cambios en el filtro
          action='filtration';    // bandera para indicar el cambio en el filtro
          if (ajax.results[options.term])
            filterContext='old';  // indica que la consulta con este filtro ya fue realizada
          else
            filterContext='new';  // se trata de consulta con nuevo filtro
        }
        else {                                // si el filtro es el mismo, el contexto del filtro
          if (options.page>lastQuery.page) {    // cacheado siempre es viejo, puede tratarse de
            action='pagination';                // paginación o recarga (cuando se reabre el combo
            filterContext='old';                // tras haber sido cerrado)
          }
          else {
            action='reload';
            filterContext='old';
          }
        }
        lastQuery.term=options.term;
        lastQuery.page=options.page;

        if (action=='reload' || (action=='filtration' && filterContext=='old')) {
          options.callback({results:ajax.results[options.term],more:ajax.more});
          return;
        }

        if (!ajax.results[options.term]) ajax.results[options.term]=[];

        window.clearTimeout(ajax.timeout);
        ajax.timeout = window.setTimeout(function () {

          ajax.requestSequence += 1;                 // increment the sequence
          var requestNumber = ajax.requestSequence;  // this request's sequence number

          var data = {
            filter: o_.field+';LIKE;%'+options.term+'%'+exclusion,
            p: (+options.page-1).toString()+';'+ajax.len,
            len: ajax.len,
            id:options.id,
            order:o_.field+'_'+o_.dir
          };
        ajax.data=data;
          $.ajax({
            url: ajax.url,
            data: data,
            dataType: 'json',
            type: 'GET',
            success: function(data) {
              ajax.results[lastQuery.term]=_.union(ajax.results[lastQuery.term],data);
              if (requestNumber < ajax.requestSequence) {
                return;
              }
              $.ajax({
                url: ajax.url + '/count',
                data: { filter: options.term },
                dataype: 'json',
                success: function(resp) {
                  var total = parseInt(resp, 10);
                  var more = (options.page * ajax.len) < total;
                  ajax.more=more;
                  options.callback({results: data, more: more});
                }
              });
            }
          });
        }, ajax.quietMillis);
      },

      id:function() {
        return id_;
      },

      initSelection: function (element, callback) {
        var id = element.val();
        // no item selected
        if (id==='') {
          callback({});
        } else {
          $.get(ajax.url+'/'+id, function(data) {
            callback(data);
          }, 'json');
        }
      }
    });


  });

    jqField.blur__=jqField.blur;
    jqField.blur=jqField.blur_;

    /**
      La siguiente función parece sobrar, pero, OJO, si se saca falla la grabación!!
      */
    $(function(){
      jqField.select2(
        'val', '1'
      );
    });
  }
});

  return DBComboControl;
});
