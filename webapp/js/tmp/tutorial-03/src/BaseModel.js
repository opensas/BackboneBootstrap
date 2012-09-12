
var src = src || {};

src.BaseModel = function(options) {
  this.url = options.url || '';
  this.filter = '';
};

src.BaseModel.prototype.getUrl = function() {
  return this.url;
};

src.BaseModel.prototype.fetch = function(callback) {
  $.getJSON(this.getUrl(), callback);
};