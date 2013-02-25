/*globals define*/

define( [
    'jquery', 'lodash',
    'src/views/BaseView',
    'text!src/views/widgets/accessibility.html'
  ], function(
    $, _,
    BaseView,
    accessibilityTemplate
  ) {

'use strict';

var View = BaseView.extend({

  initialize: function(options) {

    options = options || {};

    _.extend(this, options);

    BaseView.prototype.initialize.call(this, options);

    this.el = this.el || undefined;
    if (!this.el) throw new Error('View.el not specified!');

    this.template = this.compileTemplate(this.template || accessibilityTemplate);
    if (!this.template) throw new Error('View.template not specified!');

  },

  render: function() {
    this.$el.html(this.template());
    return this;
  }

});

  return View;
});
