/*globals define, app, require, requirejs, console*/

define( [
    'lodash', 'src/BaseObject',
    'src/controllers/LayoutController',
    'src/utils/meta', 'src/utils/user',
    'src/utils/http'
  ], function (
    _, BaseObject,
    LayoutController,
    meta, user,
    http
  ){

'use strict';

var BaseApp = BaseObject.extend({

  initialize: function(options) {

    options = options || {};

    _.extend(this, options);

    this.started = false;

    if (!this.mode)     throw new Error('app.mode not specified');
    if (!this.name)     throw new Error('app.name not specified');
    if (!this.version)  throw new Error('app.version not specified');
    if (!this.rootUrl)  throw new Error('app.rootUrl not specified');
    if (!this.endpoint) throw new Error('app.endpoint not specified');

    this.user = undefined;

    this.meta = {
      application: undefined,
      endpoint: undefined
    };

    _.extend(this.meta, options.meta || {});

    if (!this.meta.endpoint) throw new Error('app.meta.endpoint not specified');

    if (!this.meta.application) throw new Error('app.meta.application not specified');

    this.controller = this.controller || undefined;
    this.controllerModule = this.controllerModule || undefined;

    this.el = this.el || 'body';

    this.menuModule = this.menuModule || 'src/models/MenuCollection';

  },

  // loads the user permission
  // the layoutController (read MenuCollection)
  // and instantiates the controller according to the url
  start: function(callback) {
    this.started = false;
    var that = this;

    // load permissions
    this.loadUser(function(user) {
      that.user = user;
      // load layoutController
      that.loadLayoutController(function() {
        // finally, load controller from the url
        that.loadController(callback);
      });
    });
  },

  loadLayoutController: function(callback) {

    var self = this;

    // dynamically load menuCollectionModule
    require([this.menuModule], function(MenuCollection) {

      self.menuCollection = new MenuCollection();

      self.LayoutController = self.LayoutController || LayoutController;

      // initialize layoutController
      self.layoutController = self.layoutController || new self.LayoutController({
        el             : self.el,
        menuCollection : self.menuCollection
      });
      self.layoutController.start();
      callback();

    });
  },

  loadController: function(callback) {
    var that = this;

    // the controller has already been specified, just call the callback
    if (this.controller) {
      this.started = true;
      callback(this.controller);

    // got to dinamically load the controller
    } else {
      this.controllerModule = this.controllerModule || http.getControllerModuleFromUrl();
      if (!this.controllerModule) throw new Error('app.controllerModule not specified and could not inferr it from the url');

      this.requireController(
        this.controllerModule,
        this.controllerLoadedHandler(callback), // success
        this.controllerNotFoundHandler // error
      );

    }
  },

  requireController: function(controllerLocation, success, error) {

    var err;
    var controller;
    var that = this;

    // save previous requireJS error handler
    var requirejsPrevOnError = requirejs.onError;
    requirejs.onError = error;

    try {
      require([controllerLocation], function(Controller) {

        // restore requirejs error handler
        requirejs.onError = requirejsPrevOnError;

        // requireJS could not load Controller
        if (!Controller) {
          err = new Error('requireJS could not load "' + controllerLocation + '" Controller');
          error(err);
        } else {
          controller = new Controller();
          that.started = true;
          success(controller);
        }
      });

    } catch(e) {
      error(e);
    }

  },

  // the controller was not found
  // show error and rediret to rootUrl
  // redirect
  controllerNotFoundHandler: function(err) {
    // modal error message, controller not found
    console.log(err);
    console.log('about to go to ' + app.rootUrl);
    // window.location.href = app.rootUrl;
  },

  // the controller was successfully loaded
  // save a reference in the app
  // and call the callback
  controllerLoadedHandler: function(callback) {
    var that = this;
    return function(controller) {
      that.controller = controller;
      callback(controller);
    };
  },

  loadUser: function(callback) {
    user.initialize();
    meta.loadPermissions(this.meta, function(permissions) {
      user.permissions = permissions;
      callback(user);
    });
  },

  startLoading: function(message) {
    this.layoutController.startLoading(message);
  },

  completeLoading: function(message) {
    this.layoutController.completeLoading(message);
  }

});

  return BaseApp;
});
