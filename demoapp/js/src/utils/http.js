/*globals define, window*/

define(
  function() {

'use strict';

var http = {};

http.parseParams = function(url) {

  url = url || '';
  var match,
      pl     = /\+/g,  // Regex for replacing addition symbol with a space
      search = /([^&=]+)=?([^&]*)/g,
      decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
      params = {};

  while (match === search.exec(url)) {
    params[decode(match[1])] = decode(match[2]);
  }
  return params;
};

http.buildParams = function(params) {
  params = params || {};
  var url = '';
  var prop;

  for (prop in params) {
    if (params.hasOwnProperty(prop)) {
      url += encodeURIComponent(prop) + '=' + encodeURIComponent(params[prop]) + '&';
    }
  }
  return url.slice(0,-1); // remove last char
};

http.addParams = function(source, add) {

  var base = '';
  var pos = source.indexOf('?');
  var prop;

  if (! source.match(/[\?&=]/)) { // no tiene ? ni & ni = asumo que es solo base sin ningun param
    base = source;
    source = '';
  } else {
    if (pos !== -1) {
      base = source.substring(0,pos);
      source = source.substring(pos+1);
    }
  }

  if (typeof source === 'string') {source = http.parseQuery(source);}
  if (typeof add === 'string')    {add = http.parseQuery(add);}

  for (prop in add) {
    if (add.hasOwnProperty(prop)) {
      source[prop] = add[prop];
    }
  }
  var params = http.buildParams(source);

  return base + (params !== '' ? '?' + params : '');
};

http.parseQuery = function(url) {
  var query = http.parseParams(url);

  var parsed = {};

  if (query.page    !== undefined)  {parsed.page   = query.page;}
  if (query.len     !== undefined)  {parsed.len    = query.len;}
  if (query.order   !== undefined)  {parsed.order  = query.order;}
  if (query.filter  !== undefined)  {parsed.filter = query.filter;}
  if (query.q       !== undefined)  {parsed.q      = query.q;}

  return parsed;
};

http.hash = function(loc) {
  var url = loc || window.location.href;
  var hash = url.split("#")[1] || '';
  return hash;
};

// Extracts the controller from the url
// according to the following pattern: http://xxxxx/page.html#controller/params?query_params
//
// http.controller('http://localhost/item.html#hash') == 'hash'
// http.controller('http://localhost/item.html#hash/') == 'hash'
// http.controller('http://localhost/item.html#hash/sub') == 'hash'
// http.controller('http://localhost/item.html#hash?query') == 'hash'
http.controller = function(loc) {
  var hash = http.hash(loc);
  return /[^\/\?]*/.exec(hash)[0];
};

http.getControllerModuleFromUrl = function(defaultController, controllerNameTemplate) {

  defaultController = defaultController || 'Main';
  controllerNameTemplate = controllerNameTemplate || 'app/controllers/$controller$Controller';

  var controllerName = http.controller() || defaultController;
  var controllerModule = controllerNameTemplate.replace('$controller$', controllerName);
  return controllerModule;
};

  return http;
});
