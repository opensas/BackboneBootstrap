/*globals define*/

define( [
    'jquery', 'lodash',
  ], function(
    $, _
  ) {

'use strict';

var user = {};

user.name = undefined;

user.permissions = undefined;

user.initialize = function() {
  user.name = user.getCurrentUser();
};

/**
 * [getCurrentUser description]
 * @return {String} [description]
 */
user.getCurrentUser = function() {
  //mock user
  return "trabajo\\sscarano";
};

user.checkInitialized = function() {
  if (user.permissions === undefined) throw new Error("user.permissions not initialized");
};

/**
 * [can description]
 * @param  {String} resource   [description]
 * @param  {String} permission [description]
 * @return {Boolean}           [description]
 */
user.can = function(resource, permission) {
  var actions;

  permission = (permission || '*').toLowerCase();
  actions = user.permissionsByResource(resource);

  if (!actions || actions.length === 0) return false;
  if (permission === '*') return true;

  return _.contains(actions, permission);
};

/**
 * [canReadOnly description]
 * @param  {String} resource [description]
 * @return {Boolean}          [description]
 */
user.canReadOnly = function(resource) {
  var actions = user.permissionsByResource(resource);
  return (actions === ['consulta']);
};

/**
 * [permissionsByResource description]
 * @param  {String} resource [description]
 * @return {{Array.<string>}}          [description]
 */
user.permissionsByResource = function(resource) {
  user.checkInitialized();

  // assert
  resource = resource || undefined;
  if (!resource) throw new Error("resource not specified");

  return user.permissions[resource.toLowerCase()] || [];
};

  return user;
});
