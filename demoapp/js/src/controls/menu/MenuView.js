/*globals define,app,PageView, app*/

define( [
    'jquery', 'lodash',
    'src/views/BaseView',
    'text!src/controls/menu/menu-container.html',
    'text!src/controls/menu/menu-user.html',
    'text!src/controls/menu/menu-parent.html',
    'text!src/controls/menu/menu-child.html'
  ], function(
    $, _,
    BaseView,
    templateContainer,
    templateUser,
    templateParent,
    templateChild
  ) {

'use strict';

var MenuView = BaseView.extend({

  initialize: function(options) {
    options = options || {};

    _.extend(this, options);

    BaseView.prototype.initialize.call(this, options);

    this.tagName = 'div';

    if (!this.el) throw new Error('View.el not specified!');
    this.$el = $(this.el);

    if (!this.collection) throw new Error('collection not specified!');

    this.templateContainer = this.compileTemplate(this.templateContainer || templateContainer);

    this.templateUser = this.compileTemplate(this.templateUser || templateUser);

    this.templateParent = this.compileTemplate(this.templateParent || templateParent);

    this.templateChild = this.compileTemplate(this.templateChild || templateChild);

    this.collection.bind('reset', this.render, this);
  },

  render: function() {

    var htmlMenu      = this.htmlMenu(this.collection.asMenu()),
        htmlRightMenu = this.templateUser(app.user);

    var html = this.templateContainer({
      menu      : htmlMenu,
      rightMenu : htmlRightMenu
    });

    this.$el.html(html);

    return this;
  },

  htmlMenu: function(menu) {
    var html = '';

    if (!menu) return '';

    if (menu.hasChildren()) {
      var htmlChildren = '';
      _.each(menu.children, function(child) {
        htmlChildren = htmlChildren + this.htmlMenu(child);
      }, this);
      html = this.templateParent({ menu: menu, children: htmlChildren });
    } else {
      html = this.templateChild({ menu: menu, rootUrl: app.rootUrl });
    }

    return html;
  },

  clear: function() {
    this.$el.html('');
  }

});

  return MenuView;
});
