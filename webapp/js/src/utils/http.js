/*globals define*/
'use strict';

define(
  function() {

var http = {};

http.parseParams = function(url) {

  url = url || '';
  var match,
      pl     = /\+/g,  // Regex for replacing addition symbol with a space
      search = /([^&=]+)=?([^&]*)/g,
      decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
      params = {};

  while (match = search.exec(url)) {
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

  return parsed;
};

  return http;
});
