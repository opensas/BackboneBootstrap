/*globals define*/

/*
se encarga de la comunición con meta
config: puede sobreescribir application, endpoint, template
*/

define( [
    'jquery', 'lodash', 'src/utils/string'
  ], function(
    $, _, string
  ) {

'use strict';

var meta = {
  mock: false,

  permissions: undefined,

  config: {}
};

// valores por defecto para application, endpoint y template
meta.config.application = 'comprasgestion';
meta.config.endpoint = 'http://nikita2/ws-ssc/rest.asp?';
meta.config.template = '$endpoint_Servicio=meta&' +
  '_Formato=json&_Accion=Consulta&_Recurso=PermisoUsuario&' +
  'AplicacionCodigo=$application&' +
  'UsuarioCodigo=$user&' +
  '_PaginaLong=1000&' +
  '_Campos=RecursoCodigo,AccionCodigo&callback=?';   // jsonp

meta.loadPermissions = function(config, callback) {

  // overwrite configuration with config from outside
  config = config || {};
  meta.config.application = config.application || meta.config.application;
  meta.config.endpoint = config.endpoint || meta.config.endpoint;
  meta.config.template = config.template || meta.config.template;

  meta.mock = config.mock || meta.mock;

  meta.fetchPermissions(callback);
};

meta.getCurrentUser = function() {
  //#TODO mocked user
  return 'mocked\\user';
};

meta.fetchPermissions = function(callback) {

  if (meta.mock) {
    meta.permissions = meta.mockPermissions();
    callback(meta.permissions);
    return;
  }

  if (meta.permissions) {
    callback(meta.permissions);
  } else {
    var endpointUrl = meta.url();
    $.getJSON(endpointUrl, '', function(data) {
      meta.permissions = meta.reducePermissions(data.Response.Rows);
      callback(meta.permissions);
    });
  }
};

meta.mockPermissions = function() {
  return {
    'acceso offline': ['consulta'],
    'wine': ['alta', 'baja', 'modificacion', 'consulta'],
    'country': ['alta', 'baja', 'modificacion', 'consulta'],
    'review': ['alta', 'baja', 'modificacion', 'consulta'],

    // 'provincia': ['consulta'],
    // 'provincia': ['modificacion', 'consulta'],
    'accion': ['alta', 'baja', 'modificacion', 'consulta'],
    'proveedor': ['alta', 'baja', 'modificacion', 'consulta'],
    'provincia-readonly': ['consulta'],
    // 'provincia': ['consulta'],
    'situacioniva': ['alta', 'baja', 'modificacion', 'consulta'],
    'categoriasituacioniva': ['alta', 'baja', 'modificacion', 'consulta'],
    'provincia': ['alta', 'baja', 'modificacion', 'consulta'],
    'tipocomprobante': ['alta', 'baja', 'modificacion', 'consulta'],
    'comprobante': ['alta', 'baja', 'modificacion', 'consulta'],
    'comprobanteitem': ['alta', 'baja', 'modificacion', 'consulta'],
    'tiporetencion': ['alta', 'baja', 'modificacion', 'consulta'],
    'zona': ['alta', 'baja', 'modificacion', 'consulta'],
    'localidad': ['alta', 'baja', 'modificacion', 'consulta'],
    'menu': ['alta', 'baja', 'modificacion', 'consulta'],
    'tipoactividadafip': ['alta', 'baja', 'modificacion', 'consulta'],
    'actividadafip': ['alta', 'baja', 'modificacion', 'consulta'],
    'tipoasociacion': ['alta', 'baja', 'modificacion', 'consulta'],
    'tipoadjudicacion': ['alta', 'baja', 'modificacion', 'consulta'],
    'tipoprocedimiento': ['alta', 'baja', 'modificacion', 'consulta'],
    'tipopersona': ['alta', 'baja', 'modificacion', 'consulta'],
    'tipodomicilio': ['alta', 'baja', 'modificacion', 'consulta']
  };
};

meta.url = function() {
  var u = meta.config.template;

  u = string.replaceAll(u, '\\$endpoint', meta.config.endpoint);
  u = string.replaceAll(u, '\\$application', meta.config.application);
  u = string.replaceAll(u, '\\$user', meta.currentUser);

  return u;
};

// translates from:
// {
//   Response: { Status: "ok", AtEof: "0",
//   Rows: [
//     { RecursoCodigo: "Acceso offline", AccionCodigo: "CONSULTA" },
//     { RecursoCodigo: "Accion", AccionCodigo: "ALTA" },
//   ]
//   [...]
//   }
// }
// to
// {
//   "acceso offline": ["consulta"],
//   "accion": ["alta", "baja", "modificacion", "consulta"],
//   ...
// }
meta.reducePermissions = function(permissions) {
  var grouped, actions, reduced, resource;

  // first group by RecursoCodigo
  grouped = _.groupBy(permissions, function(p) { return p.RecursoCodigo; });
  reduced = {};
  for (resource in grouped) {
    if (grouped.hasOwnProperty(resource)) {
      actions = _.reduce(grouped[resource], function(memo, permission) {
        memo.push(permission.AccionCodigo.toLowerCase());
        return memo;
      }, []);
      reduced[resource.toLowerCase()] = actions;
    }
  }

  return reduced;
};

  return meta;
});
