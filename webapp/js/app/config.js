/*globals console*/
'use strict';

define(
  [],
  function() {

// returns a string identifying the environment in which the app is running
// possible values: local, openshift
var inferEndpoint = function() {
  var loc = window.location;
  // running on openshift
  if (loc.hostname.indexOf('rhcloud')!==-1) {
    return loc.protocol + '//' + loc.host + '/api';
  // running locally
  } else {   // if (location.protocol === "file:") {
    return 'http://bb-jugar.rhcloud.com/api';
    //return 'http://bb-jugar.rhcloud.com/api/wines';
  }
};

var config = {
  endpoint: inferEndpoint()
  // endpoint: 'http://localhost:9000/api/wines'
  // endpoint: 'http://bb-jugar.rhcloud.com/api/wines'
};

return config;

})