var hoolaMundo='chau';
function initSelectTable(jqField,options){
  var fs_=options.fields, ep_=options.endPoint, en_=options.entity, id_=options.id, input_=jqField;
	$(function() {

    var formatResult = function(entity) {
      var markup = "<table class='movie-result'><tr>";
      markup += "<td class='country-code'>" + formatSelection(entity) + "</td>";
      markup += "</tr></table>";
      return markup;
    };

    var formatSelection = function(entity) {
      if (entity && entity[fs_])
				return entity[fs_];
			//return country.name + ' (' + country.code + ')';
				return "";
    };

    var inferEndpoint = function() {
      return window.location.protocol+'//'+window.location.host +'/'+ ep_;
    };

    var ajax = {
      url: inferEndpoint(),
      len: 10,
      term: '',
      timeout: undefined,     // current scheduled but not yet executed request
      requestSequence: 0,     // sequence used to drop out-of-order responses
      quietMillis: 300
    };

    input_.select2({
      placeholder: '',
      minimunInputLenght: 2,
      query: function(options) {
        window.clearTimeout(ajax.timeout);
        ajax.timeout = window.setTimeout(function () {

          ajax.requestSequence += 1;                 // increment the sequence
          var requestNumber = ajax.requestSequence;  // this request's sequence number

          var data = {
            filter: fs_+';LIKE;%'+options.term+'%',
            p: (+options.page-1).toString()+';'+ajax.len,
            len: ajax.len,
						id:options.id
          };
          $.ajax({
            url: ajax.url,
            data: data,
            dataType: 'json',
            type: 'GET',
            success: function(data) {
              if (requestNumber < ajax.requestSequence) {
                return;
              }
              $.ajax({
                url: ajax.url + '/count',
                data: { filter: options.term },
                dataype: 'json',
                success: function(resp) {
                  var total = parseInt(resp, 10);
                  var more = (options.page * ajax.len) < total;
                  options.callback({results: data, more: more});
                }
              });
            }
          });
        }, ajax.quietMillis);
      },
			id:function() {
				return id_;
			},
      initSelection: function (element, callback) {
        var id = element.val();
        // no item selected
				if (id==='') {
          callback({});
        } else {
          $.get(ajax.url+'/'+id, function(data) {
            callback(data);
          }, 'json');
        }
      },
					change:function (e) {
						alert(this);
					},
      'formatResult': formatResult,
      'formatSelection': formatSelection,
      dropdownCssClass: "bigdrop" // apply css that makes the dropdown taller
    });
  });
	input_.on('change', function(e){alert(this.value);});
  $(function(){
    input_.select2(
      'val', '1'
    );
  });

}
