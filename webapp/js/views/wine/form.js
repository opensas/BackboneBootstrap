/*globals $,_,Backbone,utils,src:true*/

'use strict';
var src = src || {};
src.views = src.views || {};
src.views.wine = src.views.wine || {};

src.views.wine.FormView = Backbone.View.extend({

  initialize: function() {
    _.bindAll(this, 'save', 'success', 'cancel', 'close');
  },

  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    this.$el.show();
    $('#wines').hide();
    return this;
  },

  events: {
    'click div.save':     'save', 
    'click div.cancel':   'cancel'
  },

  save: function() {
    var attrs = {
      name:     this.$('#name').val(),
      grapes:   this.$('#grapes').val(),
      country:  this.$('#country').val(),
      region:   this.$('#region').val(),
      year:     this.$('#year').val()
    };

    if (this.model.isNew()) {
      this.collection.create(attrs, {success: this.success});
    } else {
      this.model.save(attrs, {success: this.success});
    }
  },

  success: function() {
    this.close(true);
  },

  cancel: function() {
    this.close({trigger: false});
  },

  close: function(options) {
    $('#wines').show();
    this.$el.unbind();
    this.$el.empty();
    app.navigate('wines', options);
  },

  template: _.template( ' \
<h2>Edit wine</h2> \
 \
<div class="row"> \
  <div class="span4"> \
    <p></p> \
    <p>Edit wine</p> \
    <p>Come contextual help on wine edition...</p> \
  </div> \
  <div class="span8"> \
    <form class="form-horizontal"> \
      <fieldset> \
        <div class="control-group"> \
          <label class="control-label" for="id">id</label> \
          <div class="controls"> \
            <input type="text" class="input-xlarge disabled" id="id" disabled=""  \
              value="<%= id || "new" %>"> \
            <p class="help-block">The id is automatically assigned by the web service, so you cannot edit it...</p> \
          </div> \
        </div> \
 \
        <div class="control-group"> \
          <label class="control-label" for="name">Name</label> \
          <div class="controls"> \
            <input type="text" class="input-xlarge" id="name" value="<%= name %>"> \
            <p class="help-block">Enter the name of the member</p> \
          </div> \
        </div> \
 \
        <div class="control-group"> \
          <label class="control-label" for="grapes">Grapes</label> \
          <div class="controls"> \
            <div class="input-prepend"> \
              <span class="add-on">@</span> \
              <input class="span2" id="grapes" size="16" type="text" value="<%= grapes %>"> \
            </div> \
            <p class="help-block">Enter the grapes</p> \
          </div> \
        </div> \
 \
        <div class="control-group"> \
          <label class="control-label" for="country">Country</label> \
          <div class="controls"> \
            <input type="text" class="input-xlarge" id="country" value="<%= country %>"> \
            <p class="help-block">Enter the wine\'s country</p> \
          </div> \
        </div> \
 \
        <div class="control-group"> \
          <label class="control-label" for="region">Region</label> \
          <div class="controls"> \
            <input type="text" class="input-xlarge" id="region" value="<%= region %>"> \
            <p class="help-block">Enter the wine\'s region</p> \
          </div> \
        </div> \
 \
        <div class="control-group"> \
          <label class="control-label" for="country">Year</label> \
          <div class="controls"> \
            <input type="text" class="input-xlarge" id="year" value="<%= year %>"> \
            <p class="help-block">Enter the wine\'s year</p> \
          </div> \
        </div> \
 \
        <div class="form-actions"> \
          <div class="btn btn-primary save">Save changes</div> \
          <div class="btn cancel">Cancel</div> \
        </div> \
      </fieldset> \
    </form> \
  </div> \
</div> \
    ')

});