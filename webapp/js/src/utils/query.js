/*globals define*/

define( [
    'jquery', 'lodash', 'src/utils/string', 'src/utils/toastMessage'
  ], function(
    $, _, string, toastMessage
  ) {

'use strict';

var query = {};

query.queryToJson = function(q) {
  var items, field, value;
  var json = {};
  var conditions = q.split(',');

  $.each(conditions, function(i, condition) {
    items = condition.split(':');

    if (items.length>=2) {
      field = items[0]; value = items[1];
      json[field] = value;
    }
  });

  return json;
};

query.jsonToQuery = function(json) {
  var key, value;
  var q = [];

  for(key in json) {
    if (json.hasOwnProperty(key)) {
      value = json[key];
      if (value) {
        q.push(key + ':' + value);
      }
    }
  }
  return q.join(',');
};

  return query;
});
