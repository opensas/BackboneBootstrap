/*globals define*/

define( [
    'jquery', 'lodash', 'src/utils/string', 'src/utils/toastMessage'
  ], function(
    $, _, string, toastMessage
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

  var pagesToShow = options.pagesToShow || 3; // show 3 pages before the current one, the current one, and 3 pages after: 7 pages

  var c;
  var page   = parseInt(collection.page, 10);
  var len    = parseInt(collection.len, 10);
  var from   = ((page-1)*len)+1;
  var to     = from+collection.length-1;
  var total  = collection.total;
  var last   = Math.ceil(total/len);

  var pages = [];

  //first page
  pages.push({page: 1 , text: "««", active: false, enabled: page > 1});
  //previous page
  pages.push({page: Math.max(1,page-1) , text: "«", active: false, enabled: page > 1});

  // allways show 'pagesToShow' pages before the current and 'pagesToShow' pages after the current
  var beginPage = page - (pagesToShow);
  if (beginPage < 1) {beginPage = 1;}
  var endPage = beginPage + (pagesToShow * 2) + 1; // pre, current, post

  for(c = beginPage; c<endPage; c++) {
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

crud.highlight = function(text, search, before, after) {
  if (!search) { return text; }
  if (!text) { return text; }

  before = before || '<span class="label label-info">';
  after = after || '</span>';

  var pos = text.toLowerCase().indexOf(search.toLowerCase());
  if (pos!==-1) {
    return text.substring(0,pos) +
      before +
      text.substring(pos,pos+search.length) +
      after +
      text.substring(pos+search.length);
  } else {
    return text;
  }
  
};

crud.highlightItems = function(items, search, before, after) {
  var highlight = crud.highlight;
  search = search.toLowerCase();
  items.each(function() {
    var item = $(this);
    if (item.text().toLowerCase().indexOf(search)!==-1) {
      item.html(highlight(item.html(), search, before, after));
    }
  });
};

crud.generateTableRowTemplate = function(tableFields) {

  if (!tableFields || !_.isArray(tableFields) || tableFields.length===0) { 
    throw new Error('Cannot generate table row template. No columns specified.');
  }

  var template = '';
  $.each(tableFields, function(i, tableField) {
    template += '  <td><%= ' + tableField.field + ' %></td> \n';
  });
  return template;
};

crud.generateTableTitlesHtml = function(tableFields) {

  if (!tableFields || !_.isArray(tableFields) || tableFields.length===0) { 
    throw new Error('Cannot generate table table titles html. No columns specified.');
  }

  var html = '';
  $.each(tableFields, function(i, tableField) {
    var order = tableField.order === undefined ? tableField.field : tableField.order;
    var label = tableField.label || tableField.field;

    if (_.isBoolean(order) && !order) {
      html += '  <th>' + label + '</th> \n';
    } else {
      html += '  <th order="' + order + '">' + label + '<i class="icon-order"></i></th> \n';
    }
  });
  return html;
};

crud.generateFormTemplate = function(formFields) {

  if (!formFields || !_.isArray(formFields) || formFields.length===0) { 
    throw new Error('Cannot generate form template. No form fields specified.');
  }

  var template = '';
  $.each(formFields, function(i, formField){
    template += crud.generateInputTemplate(formField);
  });

  return template;
};

crud.generateInputTemplate = function(formField) {

  var field = formField.field || '';
  if (!field) { 
    throw new Error('Could not generate imput template. No value specified for field name.'); 
  }

  var readOnly = formField.readOnly || false;
  var label    = formField.label || field;
  var help     = formField.help || '';
  var control  = formField.control || 'input';
  var rows     = formField.rows || 3;
  var span     = formField.span || '';

  var groupTemplate = 
'  <div class="control-group"> ' + '\n' +
'    <label class="control-label" for="%field%">%label%</label>' + '\n' +
'    <div class="controls">' + '\n' +
'      %control%' + '\n' +
'      <p class="help-inline">%help%</p>' + '\n' +
'      <ul></ul>' + '\n' +
'    </div>' + '\n' +
'  </div>';
  
  var inputTemplate    = '<input type="text" class="span%s" id="%field%" value="<%= %field% %>">';
  var idTemplate       = '<span class="span%s uneditable-input"><%= id || "new" %></span>';
  var readOnlyTemplate = '<span class="span%s uneditable-input"><%= %field% %></span>';
  var textAreaTemplate = '<textarea class="span%s" id="description" rows="%rows%"><%= %field% %></textarea>';

  var controlTemplate;

  if (control === 'id') { controlTemplate = idTemplate; }
  else if (control === 'textarea') { controlTemplate = textAreaTemplate; }
  else if (readOnly) { controlTemplate = readOnlyTemplate; }
  else { controlTemplate = inputTemplate; }

  // take care of span
  controlTemplate = string.repl(controlTemplate, 'span%s', span);

  groupTemplate = string.replaceAll(groupTemplate, '%control%', controlTemplate);
  
  groupTemplate = string.replaceAll(groupTemplate, '%field%', field);
  groupTemplate = string.replaceAll(groupTemplate, '%label%', label);
  groupTemplate = string.replaceAll(groupTemplate, '%help%', help);
  groupTemplate = string.replaceAll(groupTemplate, '%rows%', rows);

  return groupTemplate;

};


/**
 * Dynamically generates and object with the values of each input, select or textarea
 * by inspecting the defaults from the model
 * @param  {Object} model [description]
 * @return {Object}       json object representing the edited object
 *
 * Example: with the following defaults:
 * {
 *   id:   null,
 *   name: 'new name'
 *   age:  20
 * }
 *
 * getAttrs will search in (el) for #id, #name and #age
 * and will return an object with it's values, like this:
 *
 * {
 *   id:   $(el).find('#id'),
 *   name: $(el).find('#name'),
 *   age:  $(el).find('#age'),
 * }
 *
 * This function is primarily used from the save method of the FormView
 * in order to pass it as a parameter to 
 * collection.create(attrs) if it's a new object, 
 * or model.save(attrs) if we are editing an existing object
 * 
 */

crud.getAttrs = function(defaults, el) {
  var editedModel = {};
  var $el = $(el);
  var input = undefined;

  $.each(defaults, function(key) {
    input = $el.find('#'+key);
    if (input.length) {
      editedModel[key] = $el.find('#'+key).val();
    } 
  });
  return editedModel;
};

crud.saveModel = function(attrs, model, collection, success, error, message) {

  message = message || 'Grabando cambios...';

  toastMessage.addProcess(message);

  var callbacks = {
    success: function(model, response) {
      toastMessage.removeProcess();
      if (success) { return success(model, response); }
    },
    error: function(model, response) {
      toastMessage.removeProcess();
      if (error) { return error(model, response); }
    }
  }

  if (model.isNew()) {
    collection.create(attrs, callbacks);
  } else {
    model.save(attrs, callbacks);
  }

}

  return crud;
});
