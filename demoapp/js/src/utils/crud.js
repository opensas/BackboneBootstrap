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
  if (beginPage < 1) {beginPage = 1;}

  var endPage = beginPage + (pagesToShow * 2) + 1; // pre, current, post

  for(c = beginPage; c < endPage; c++) {
    if (c > last) break;
    pages.push({page: c, text: c.toString(), active: (c === page), enabled: c <= last});
  }

  //next page
  pages.push({page: page + 1, text:"»", active: false, enabled: page < last});
  //last page
  pages.push({page: last, text:"»»", active: false, enabled: page < last});

  if (total===0) from=0;
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

crud.getids = function(entity) {
  switch (entity) {
  default:
    return entity + 'Id';
  }
};

crud.highlight = function(text, search, before, after) {
  if (search === '') { return text; }
  if (!text) { return text; }

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

crud.generateFormTemplate = function(formFields) {

  if (!formFields || !_.isArray(formFields) || formFields.length === 0) {
    throw new Error('Cannot generate form template. No form fields specified.');
  }

  var template = '';
  _.each(formFields, function(formField){
    template += crud.generateInputTemplate(formField);
  });

  return template;
};

crud.generateInputTemplate = function(formField) {

  var field = formField.field || '';
  if (!field) {
    throw new Error('Could not generate input template. No value specified for field name.');
  }

  var readOnly = formField.readOnly || false,
      label    = formField.label || field,
      help     = formField.help || '',
      control  = formField.control || 'input',
      rows     = formField.rows || 3,
      span     = formField.span || '';

  var groupTemplate =
  '  <div class="span%#span"> ' + '\n' +
  '  <label class="control-label" for="%field%">%label%</label> ' + '\n';

  if (help) {
    groupTemplate +=
    '  <i class="icon-question-sign" rel="popover" ' + '\n' +
    '    data-content="%help%" ' + '\n' +
    '    data-original-title="Ayuda"></i>' + '\n';
  }

  groupTemplate +=
    '  %control%' + '\n' +
    '  <ul></ul> ' + '\n' +
    '</div>';

  var inputTemplate       = '<input type="text" class="span%s" id="%field%" value="<%= %field% %>">';
  var idTemplate          = '<span class="span%s uneditable-input" id="%field%"><%= id || "new" %></span>';
  var readOnlyTemplate    = '<span class="span%s uneditable-input" id="%field%"><%= %field% %></span>';
  var textAreaTemplate    = '<textarea class="span%s" id="%field%" rows="%rows%" style="resize:none"><%= %field% %></textarea>';
  var datepickerTemplate  = '<input type="text" class="datepicker span%s" id="%field%" value="<%= %field% %>">';
  var checkboxTemplate    = '<input type="checkbox" id="%field%" value="<%= %field% %>">%label%</input>';
  var selectTableTemplate = '<div class="container"><div class="span%s" style="margin-left:0px"><h3 style="display:none"></h3><p><input type="hidden" value="0" class="bigdrop span%s" id="%field%" tabindex="0"/></p></div></div>';
  //  '<div class="container"><article class="row" id="basics"><div class="span4"><p><input type="hidden" value="12" class="bigdrop span3" id="%field%" style="width:300px" tabindex="0"/></p></div></article></div>';

  var controlTemplate;

  if (control === 'id') { controlTemplate = idTemplate; }
  else if (control === 'textarea') { controlTemplate = textAreaTemplate; }
  else if (readOnly) { controlTemplate = readOnlyTemplate; }
  else if (control === 'datepicker') {controlTemplate = datepickerTemplate; }
  else if (control === 'checkbox') { controlTemplate = checkboxTemplate; }
  else if (control === 'selectTable') { controlTemplate = selectTableTemplate; }
  else { controlTemplate = inputTemplate; }

  // take care of span
  controlTemplate = string.repl(controlTemplate, 'span%s', span);

  groupTemplate = string.replaceAll(groupTemplate, '%control%', controlTemplate);

  groupTemplate = string.replaceAll(groupTemplate, '%#span', span);
  groupTemplate = string.replaceAll(groupTemplate, '%field%', field);
  groupTemplate = string.replaceAll(groupTemplate, '%label%', label);
  groupTemplate = string.replaceAll(groupTemplate, '%help%', help);
  groupTemplate = string.replaceAll(groupTemplate, '%rows%', rows);

  return groupTemplate;

};

/**
 * Dynamically generates an object with the values of each input, select or textarea
 * by inspecting the fields collection from the model
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

crud.getAttrs = function(model, el) {
  var editedModel = {},
      $el         = $(el),
      control, type, value;

  _.each(model.fields, function(field, name) {

    var fieldName = field.controlId;
    control = crud.findControl($el, '#' + fieldName);

    if (control.length) {
      type  = crud.inferFieldType(name, model);
      value = convert.convert(control.val(), type);
      if (field.type === 'child') {
        editedModel[name] = crud.getChildValue(fieldName, value);
      } else {
        editedModel[name] = value;
      }
    }

  });
  return editedModel;
};

/**
 * escapes the selector with dots in it
 * to match input of child elements like
 * <select id='Invoice.DetailId' ...
 *
 * jquery requires dots to be escaped inside selectors, like this:
 * $('#Invoice\\.DetaildId')
 *
 * @param  {[type]} el       [description]
 * @param  {[type]} selector [description]
 * @return {[type]}          [description]
 */
crud.findControl = function(el, selector) {
  return $(el).find(selector.replace('.', '\\.'));
};

crud.getChildValue = function(controlId, value) {
  var parts   = controlId.split('.'),
      parent, child, ret;

  if (parts.length < 2) throw new Error('the control id "' + controlId + '" does not seems to be a child control. need a parent.child id.');

  parent = parts[0];
  child = parts[1];

  ret = {};
  ret[child] = value;

  return ret;
},

  // // #TODO: document this code
  // // #TODO: reimplement this code, should use _ and take into account fields collection
  // $.each(defaults, function(key) {
  //   var input = $el.find('#' + key),
  //       span  = $el.find('span#' + key);

  //   if (model.attributes[key] instanceof Object) {
  //     editedModel[key] = model.get(key);
  //   } else {
  //     if (input.length) editedModel[key] = input.val();
  //     if (span.length) editedModel[key] = span.text();
  //   }
  // });
  // return editedModel;

/**
 * [inferFieldType description]
 * @param  {String}     fieldName [description]
 * @param  {BaseModel}  model     [description]
 * @return {String}               [description]
 */
crud.inferFieldType = function(fieldName, model) {
  model = model || {};

  var defaults = model.defaults,
      field    = model.fields ? model.fields[fieldName] : undefined;

  // first check if there's a field defined in the model
  if (field && field.type) {
    if (field.type === 'child') return 'number';
    return field.type;
  }

  // check if there's a defaults value defined
  if (defaults && defaults[fieldName]) {
    return convert.basicType(defaults[fieldName]);
  }

  // no luck, by default string
  return 'string';
}

/**
 * Disables all inputs, combos and textareas in the specified selector
 * by inspecting the array fields
 *
 */

crud.disableControls = function(el) {
  $(el).find('input, textarea, select').attr('disabled', '');
};

/**
 * Dynamically generates an object with the values of each input, select or textarea
 * by inspecting the array fields
 * Works just like crud.getAttrs
 * @param  {Object} model [description]
 * @return {Object}       json object representing the edited object
 *
 * Example: with the following fields:
 * [
 *   { field: 'id',     label: 'Id' },
 *   { field: 'name',   label: 'Name' },
 *   { field: 'age',    label: 'Age' },
 * ]
 *
 * getAttrsFromFields will search in (el) for #id, #name and #age
 * and will return an object with it's values, like this:
 *
 * {
 *   id:   $(el).find('#id'),
 *   name: $(el).find('#name'),
 *   age:  $(el).find('#age'),
 * }
 *
 * This function is primarily used to fetch the values enterd in the queryView
 * in order to pass it as a parameter to
 * collection.query
 *
 */

crud.getAttrsFromFields = function(fields, el) {
  var editedModel   = {},
      $el           = $(el),
      input         = undefined,
      fieldName     = '',
      strFieldName  = '',
      index;

  $.each(fields, function(i, field) {
    fieldName = field.field;

    // Esto permite que Jquery pueda buscar un Id# con punto ej. $('Entidad.Atributo') --> $('Entidad\\.Atributo')
    // scapeFieldName = fieldName.replace(/\./g,"\\\\.");
    var arrFieldName = [];

    if (fieldName.indexOf(".") > -1) {
      arrFieldName = fieldName.split('.');
      strFieldName = '#';

      for (index = 0; i < arrFieldName.length; i++) {
        strFieldName += arrFieldName[i];
        strFieldName += '\\.';
      }
      strFieldName = strFieldName.substring(0, strFieldName.length-2); // quito el ultimo separador

      input = $el.find(strFieldName);
    } else {
      input = $el.find('#'+ fieldName);
    }

    if (input.length) {
      editedModel[fieldName] = input.val();
    }
  });
  return editedModel;
};

crud.saveModel = function(model, collection, success, error, message) {

  message = message || 'Grabando cambios...';

  toastMessage.addProcess(message);

  var callbacks = {
    success: function(model, response, options) {
      toastMessage.removeProcess();
      if (success) { return success(model, response, options); }
    },
    error: function(model, response, options) {
      toastMessage.removeProcess();
      if (error) { return error(model, response, options); }
    }
  };

  if (model.isNew()) {
    collection.create(model.attributes, callbacks);
  } else {
    model.save(model.attributes, callbacks);
  }

};

/*
  Parsea el view.model.formFields, buscando controles "tipo plugin" que requieran tratamiento especial
  para la correcta inicialización.
Controles Procesados:
  selectTable
*/
crud.initControls = function(view) {
  if (!view || !view.model || !view.model.formFields) { return; }

  var formFields = view.model.formFields,
      related, relatedField, select, i;

  for (i=0; i<formFields.length; ++i) {
    if (formFields[i].control) {
      switch (formFields[i].control) {
      case 'selectTable':
        formFields[i].options.id=this.getids(formFields[i].options.entity);

        related = view.model.attributes[formFields[i].field];
        relatedField = formFields[i].options.value;
        view.$('#'+formFields[i].field).attr('value',related[relatedField]);//view.model.attributes[formField[i]]);
        select = view.$('#'+formFields[i].field);
        initSelectTable(select,formFields[i].options);
        select.on('change', function(e,select) {
          alert(this.value);
        });
        break;
      }
    }
  }
};

  return crud;
});
