/*globals define,app,console*/

define( [
    'lodash', 'backbone'
  ], function(
    _, Backbone
  ) {

'use strict';

var BaseView = Backbone.View.extend({

  initialize: function(options) {

    options = options || {};

    this.controller = undefined;
    this.views = [];

    Backbone.View.prototype.initialize.call(this, options);

    this.controller = options.controller || this.controller || undefined;
    // #TODO - see how to keep this validation
    // if (!this.controller) throw new Error('View.controller not specified!');

  },

  destroy: function() {
    this.destroyViews();
    this.undelegateEvents();
    this.stopListening();
    this.remove();
    this.off();      // formerly known as unbind
    return this;
  },

  destroyViews: function() {
    //- call destroy method for each view
    _.invoke(this.views, 'destroy');
    delete this.views; // or this.views = null
    this.views = [];
    return this;
  },

  show: function() {
    if (this.$el) this.$el.show();
    return this;
  },

  hide: function() {
    if (this.$el) this.$el.hide();
    return this;
  },

  clear: function() {
    this.$el.html('');
    return this;
  },

  /**
   * Compiles the specified template.
   *
   * @param  {function():String|String} template template source or template function
   * @return {function():String}          A template function.
   */
  compileTemplate: function(template) {

    // a string has been passed as a template, compile it
    if (_.isString(template)) {
      return _.template(template);

    // a function has been passed as a template, no need to compile it
    } else if (_.isFunction(template)) {
      return template;
    } else {
      throw new Error('Invalid template specified. Should be a function or a string.');
    }
  },

  $byId: function(selector) {
    if (selector.substr(0,1) !== '#') selector = '#' + selector;
    return this.$el.find(selector.replace('.', '\\.'));
  }

});

  return BaseView;
});
