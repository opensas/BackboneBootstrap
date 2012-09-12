
var src = src || {};

src.BaseView = function(options) {

  this.model = options.model || undefined;

  this.el = $(options.el) || undefined;

  this.template = Handlebars.compile($(options.template).html()) || undefined;

  this.data = undefined;
};

src.BaseView.prototype.render = function() {
  var that = this;
  this.model.fetch(function(json) {
    var html = that.template({data: json});
    $(that.el).html(html);
  });
};