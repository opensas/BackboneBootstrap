/*globals define, alert*/

define( [
    'jquery', 'lodash', 'src/utils/convert',
    'src/utils/string', 'src/utils/toastMessage',
    'src/controls/selectTable'
  ], function(
    $, _, convert,
    string, toastMessage,
    selectTable
  ) {

'use strict';

var crud = {};

/**
 * Generates the information to display the paginator from the collection.
 *
 * @param     {BaseCollection} collection the collection to paginate
 * @options   {Object} aditional configuration
 *
 * @return
 * {
 *   page:    number, current page
 *   len:     number, records per page
 *   from:    number, number of first record in page, ((page-1)*len)+1
 *   to:      number, number of last record in page, from + collection.length-1
 *   total:   number, total number of records corresponding to the query, regardless pagination
 *   last:    number: last page
 *   pages: [  each page element represents a link to a page
 *     {page: 1 , text: "1", active: true, enabled: true},
 *     {page: 2 , text: "2", active: false, enabled: true},
 *     ...
 *   ]
 * }
 *
 * It checks collection.page, collection.len and collection.total
 * And generates a data structure with all the information needed
 * to display the paginator
 *
 */
crud.paginate = function(collection, options) {

  options = options || {};

  var pagesToShow = options.pagesToShow || 3, // show 3 pages before the current one, the current one, and 3 pages after: 7 pages
      page        = parseInt(collection.page, 10),
      len         = parseInt(collection.len, 10),
      from        = ((page-1) * len) + 1,
      to          = from + collection.length-1,
      total       = collection.total,
      last        = Math.ceil(total / len),
      pages       = [],
      c;

  //first page
  pages.push({page: 1 , text: "««", active: false, enabled: page > 1});
  //previous page
  pages.push({page: Math.max(1, page-1), text: "«", active: false, enabled: page > 1});

  // allways show 'pagesToShow' pages before the current and 'pagesToShow' pages after the current
  var beginPage = page - (pagesToShow);
  if (beginPage < 1) beginPage = 1;

  var endPage = beginPage + (pagesToShow * 2) + 1; // pre, current, post

  for(c = beginPage; c < endPage; c++) {
    if (c > last) break;
    pages.push({ page: c, text: c.toString(), active: (c === page), enabled: c <= last });
  }

  //next page
  pages.push({ page: page + 1, text: "»", active: false, enabled: page < last });
  //last page
  pages.push({ page: last, text: "»»", active: false, enabled: page < last });

  if (total === 0) from = 0;
  return {
    page  : page,
    len   : len,
    from  : from,
    to    : to,
    total : total,
    last  : last,
    pages : pages
  };
};

crud.highlight = function(text, search, before, after) {
  if (search === '') return text;
  if (!text) return text;

  if (search === null && this.highlightPattern !== null) {
    return text.replace(this.highlightPattern, before + '$1' + after);
  }

  before = before || '<span class="label label-info">';
  after = after || '</span>';

  var pos = text.toLowerCase().indexOf(search.toLowerCase());
  if (pos !== -1) {
    return text.substring(0, pos) +
      before +
      text.substring(pos, pos + search.length) +
      after +
      text.substring(pos + search.length);
  } else {
    return text;
  }

};

crud.highlightPattern = null;

crud.highlightItems = function(items, search, before, after) {

  search = convert.escapeRegExp(search);
  this.highlightPattern = null;

  var pattern = new RegExp('(' + search + ')', 'igm');
  before = before || '<span class="label label-info collapsed">';
  after = after || '</span>';

  items.each(function() {
    var item = $(this);
    var text = item.html();

    if (pattern.test(text)) {
      item.html(item.html().replace(pattern, before + "$1" + after));
    }
  });
};

crud.generateTableRowTemplate = function(tableFields) {

  if (!tableFields || !tableFields instanceof Array || tableFields.length===0) {
    throw new Error('Cannot generate table row template. No columns specified.');
  }

  var template = '';
  _.each(tableFields, function(tableField) {
    template += '  <td><%= ' + tableField.displayTemplate + ' %></td> \n';
  });
  return template;
};

crud.generateTableTitlesHtml = function(tableFields) {

  if (!tableFields || !tableFields instanceof Array || tableFields.length === 0) {
    throw new Error('Cannot generate table titles html. No columns specified.');
  }

  var html = '';
  _.each(tableFields, function(field) {
    var order = field.order,
        label = field.label;

    if (_.isBoolean(order) && !order) {
      html += '  <th>' + label + '</th> \n';
    } else {
      html += '  <th order="' + order + '">' + label + '<i class="icon-order"></i></th> \n';
    }
  });
  return html;
};

  return crud;
});
