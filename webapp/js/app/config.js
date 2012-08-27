/*globals console*/
'use strict';

var app = app || {};

(function() {     // use an anonymous autoexec function to avoid polluting app.inferEndpoint

  // returns a string identifying the environment in which the app is running
  // possible values: local, openshift
  var inferEndpoint = function() {
    var location = window.location;
    // running on openshift
    if (location.hostname.indexOf('rhcloud')!==-1) {
      return location.origin + '/api/wines';
    // running locally
    } else {   // if (location.protocol === "file:") {
      return 'http://localhost:9000/api/wines';
    }
  };

  app.config = {
    endpoint: inferEndpoint()
    // endpoint: 'http://localhost:9000/api/wines'
    // endpoint: 'http://bb-jugar.rhcloud.com/api/wines'
  };

}());