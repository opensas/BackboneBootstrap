/*globals describe,beforeEach,it,expect*/
'use strict';

describe("BaseView", function() {

  var html, mockModel, view, expected;

  var getTable = function() {
    var ret = new Array();
    $('#view-table td').each( function() { 
      ret.push($(this).text());
    });
    return ret;
  };

  beforeEach(function() {

    html = '\
<table id="view-table"> \
</table> \
<script type="text/template" id="view-template"> \
  {{#each data}} \
  <tr> \
    <td>{{id}}</td> \
    <td>{{code}}</td> \
  </tr> \
  {{/each}} \
</script> \
';
    $('#html-container').html(html);

    mockModel = {
      filter: '',
      fetch: function(callback) {
        if (this.filter === '') {
          callback([
            { id: 1, code: 'code 01' },
            { id: 2, code: 'code 02' },
            { id: 3, code: 'code 03' }
          ]);
          return;
        };

        if (this.filter === '2') {
          callback([
            { id: 2, code: 'code 02' }
          ]);
          return;
        };

        // not found
        callback([]);
      }
    };

    view = new src.BaseView({
      el: '#view-table',
      model: mockModel,
      template: '#view-template'
    });

  });

  afterEach(function() {
    $('#html-container').html('');
  });

  describe("when no filter is defined", function() {
    it("it should render all items", function() {

      view.model.filter = '';
      view.render();

      expected = ['1', 'code 01', '2', 'code 02', '3', 'code 03'];

      expect(getTable()).toEqual(expected);
    });
  });

  describe("when an item is found", function() {
    it("it should render only the item found", function() {

      view.model.filter = '2';
      view.render();

      expected = ['2', 'code 02'];

      expect(getTable()).toEqual(expected);
    });
  });

  describe("when no item is found", function() {
    it("it should not render any item leave", function() {

      view.model.filter = '4';
      view.render();

      expected = [];
      expect(getTable()).toEqual(expected);

      expected = '';
      expect($('#view-table').html().trim()).toEqual(expected);
    });
  });

});