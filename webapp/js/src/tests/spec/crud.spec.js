/*globals describe,beforeEach,it,expect*/

define(
  ['src/utils/crud', 'spec/stringHelper'],
  function(crud) {

'use strict';

describe("utils.crud.highlight helper", function() {

  var highlight, search, text, expected;

  beforeEach(function() {
     highlight = crud.highlight;    // namespace shorcut
     search = text = expected = '';
  });

  describe("when no highlight term is passed", function() {
    it("it should return the original text", function() {

      text = 'original text that should not be modified';
      search = '';

      expect(highlight(text, search)).toEqual(text);
    });
  });

  describe("when no text is passed", function() {
    it("it should return the original text", function() {

      text = undefined;
      search = 'search me!';

      expect(highlight(text, search)).toEqual(text);
    });
  });

  describe("when the term is found", function() {
    it("it should surround the term with the enclosing text", function() {

      text = 'come on and highlight the "search me!" term';
      search = 'search me!';
      expected = 'come on and highlight the "<span class="label label-info">search me!</span>" term';

      expect(highlight(text, search)).toEqual(expected);
    });
  });

  describe("when the before enclosing tag is not specified", function() {
    it('it should take \'<span class="label label-info">\' as default', function() {

      text = 'highlight me, please';
      search = 'me';
      expected = 'highlight <span class="label label-info">me';

      expect(highlight(text, search)).toStartWith(expected);
    });
  });

  describe("when the after enclosing tag is not specified", function() {
    it('it should take \'</span>\' as default', function() {

      text = 'highlight me, please';
      search = 'please';
      expected = 'please</span>';

      expect(highlight(text, search)).toEndWith(expected);
    });
  });

  describe("when the text has mixed upper and lower case", function() {
    it('it should search with case unsensitive but it should respect the original case', function() {

      text = 'PleAse HighLight Me!';
      search = 'me';
      expected = 'PleAse HighLight <span class="label label-info">Me</span>!';

      expect(highlight(text, search)).toEqual(expected);
    });
  });

//   describe("when the text has more than one match", function() {
//     it('it should highlight every match', function() {

//       text = 'please highlight me and me... and don\'t forget about me!';
//       search = 'me';
//       expected = '\
// please highlight <span class="label label-info">me</span> \
// and <span class="label label-info">me</span>... \
// and don\'t forget about <span class="label label-info">me</span>!\
// ';
//       expect(highlight(text, search)).toEqual(expected);
//     });
//   });

});

describe("utils.crud.highlightItems helper", function() {

  var highlightItems, originalHtml, originalDom, items, search, expected;

  beforeEach(function() {
    highlightItems = crud.highlightItems;
    search = '';
    expected = '';
    originalHtml = '\
<table id="highlightItems-table">\
  <tr>\
    <td id="td-1_1">row 1, col 1, search1, more text</td>\
    <td id="td-1_2">row 1, col 2, search1, more text</td>\
  </tr>\
  <tr>\
    <td id="td-2_1">row 2, col 1, SeArch2, more text</td>\
    <td id="td-2_2">row 2, col 2, SeArch2, more text</td>\
  </tr>\
  <tr>\
    <td id="td-3_1">row 3, col 1, search3, more text, search3, even more text</td>\
    <td id="td-3_2">row 3, col 2, search3, more text, search3, even more text</td>\
  </tr>\
';
    $('#html-container').html(originalHtml);
    originalHtml = $('#html-container').html();
    originalDom = $('#html-container').clone(false);

    items = $('#highlightItems-table td');
  });

  afterEach(function() {
    $('#html-container').html('');
  });

  describe("when the text is not found", function() {
    it("it should leave the dom untouched", function() {

      search = "you won't find me";
      highlightItems(items, search);

      expect($('#html-container').html()).toEqual(originalHtml);
    });
  });

  describe("when no items are found", function() {
    it("it should leave the dom untouched", function() {

      search = "row";
      items = $('#highlightItems-table td.not-found');
      highlightItems(items, search);

      expect($('#html-container').html()).toEqual(originalHtml);
    });
  });

  describe("when items are found", function() {

    it("it should modify the affected items, leaving the rest of the dom untouched", function() {
      search = "search1";
      highlightItems(items, search, '<high>', '</high>');

      expect($('#td-1_1').html()).toEqual('row 1, col 1, <high>search1</high>, more text');
      expect($('#td-1_2').html()).toEqual('row 1, col 2, <high>search1</high>, more text');

      expect($('#td-2_1').html()).toEqual(originalDom.find('#td-2_1').html());
      expect($('#td-2_2').html()).toEqual(originalDom.find('#td-2_2').html());
      expect($('#td-3_1').html()).toEqual(originalDom.find('#td-3_1').html());
      expect($('#td-3_2').html()).toEqual(originalDom.find('#td-3_2').html());
    });

    it("it should respect lower of upper case of matched text", function() {
      search = "search";
      highlightItems(items, search, '<high>', '</high>');

      expect($('#td-1_1').html()).toEqual('row 1, col 1, <high>search</high>1, more text');
      expect($('#td-1_2').html()).toEqual('row 1, col 2, <high>search</high>1, more text');

      expect($('#td-2_1').html()).toEqual('row 2, col 1, <high>SeArch</high>2, more text');
      expect($('#td-2_2').html()).toEqual('row 2, col 2, <high>SeArch</high>2, more text');
      
      expect($('#td-3_1').html()).toEqual('row 3, col 1, <high>search</high>3, more text, search3, even more text');
      expect($('#td-3_2').html()).toEqual('row 3, col 2, <high>search</high>3, more text, search3, even more text');

      // multiple matchs
      // expect($('#td-3_1').html()).toEqual('row 3, col 1, <high>search</high>3, more text, <high>search</high>3, even more text');

    });

  });

});

});