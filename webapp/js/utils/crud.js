/*globals $*/

'use strict';
var utils = utils || {};
utils.crud = utils.crud || {};

utils.crud.paginate = function(collection) {

  var pagesToShow = 3; // show 3 pages before the current one, the current one, and 3 pages after: 7 pages

  /*
  var info = {
    page:   undefined,
    len:    undefined,
    from:   undefined,
    to:     undefined,
    total:  undefined,
    last:   undefined,
    pages: [{page: 1 , text: "1", active: true, enabled: true}]
  }
  */

  var c;
  var page   = parseInt(collection.page,10);
  var len    = parseInt(collection.len,10);
  var from   = ((page-1)*len)+1;
  var to     = from+collection.length-1;
  var total  = collection.total;
  var last   = Math.ceil(total/len);

  var pages = [];

  //first page
  pages.push({page: 1 , text: "««", active: false, enabled: page > 1});
  //previous page
  pages.push({page: Math.max(1,page-1) , text: "«", active: false, enabled: page > 1});

  // allways show 4 pages before the current and 4 pages after the current
  var beginPage = page - (pagesToShow);
  if (beginPage < 1) {beginPage = 1;}
  var endPage = beginPage + (pagesToShow * 2) + 1; // pre, current, post

  for(c = beginPage; c<(endPage); c++) {
    if (c > last) {
      break;
    }
    pages.push({page: c, text:c.toString(), active: (c===page), enabled: c <= last});
  }

  //next page
  pages.push({page: page + 1, text:"»", active: false, enabled: page < last});
  //last page
  pages.push({page: last, text:"»»", active: false, enabled: page < last});

  return {
    page:   page,
    len:    len,
    from:   from,
    to:     to,
    total:  total,
    last:   last,
    pages:  pages  
  };
};

utils.crud.highlight = function(text, search) {
  var pos = text.toLowerCase().indexOf(search.toLowerCase());
  if (pos!==-1) {
    return text.substring(0,pos) +
      '<span class="label label-info">' +
      text.substring(pos,pos+search.length) +
      '</span>' +
      text.substring(pos+search.length);
  } else {
    return text;
  }
  
};

utils.crud.highlightItems = function(items, search) {
  search = search.toLowerCase();
  items.each(function() {
    var item = $(this);
    if (item.text().toLowerCase().indexOf(search)!==-1) {
      item.html(utils.crud.highlight(item.html(), search));
    }
  });
};