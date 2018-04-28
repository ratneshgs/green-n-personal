var BASE_URL = "http://localhost:8080/";
var SITE_URL = "http://localhost/card/"
var FORM_SUBMIT = 0;
function getParameter(params){
    url = window.location.href.replace("#","");
    var urlArr = url.split("?");
    let searchParams = new URLSearchParams(urlArr[1]);

    return searchParams.get(params) // true
  //searchParams.get("age") === "1337"; // true
  }


function getData(form_id,callback){
  $.ajax({
    method: "GET",
    url: BASE_URL+"api/frontend/form?id="+form_id,
    contentType: "application/json;charset=utf-8",
    //data: JSON.stringify({ data:JSON.stringify(formData) , title:jQuery("#title").val()})
  })
  .done(function( data ) {
    var form_data = JSON.stringify(data.data.data)
    form_data = form_data.replace(/[\n\r\t]/g,);
    console.log(form_data);
    window.sessionStorage.setItem('formData', JSON.stringify(data.data.data));    
    callback();
  });

}

function getCardData(product_id,order_id,callback){
  $.ajax({
    method: "GET",
    url: BASE_URL+"api/frontend/getorderformdata?product_id="+product_id+"&order_id="+order_id,
    contentType: "application/json;charset=utf-8",
    //data: JSON.stringify({ data:JSON.stringify(formData) , title:jQuery("#title").val()})
  })
  .done(function( data ) {
    //console.log(data);
    callback(data.data.card_data);
  });

}

var formsubmit = function() {
  
  var formData = new FormData(document.forms[1]);
  console.log('Can submit: ', document.forms[1].checkValidity());
  // Display the key/value pairs
  console.log('FormData:', formData);
  var postarr = {};
  for(var pair of formData.entries()) {
      //postarr.push(pair);
    postarr[pair[0]] = pair[1]
    console.log(pair[0]+ ': '+ JSON.stringify(pair[1]));
  }

  
  var card_id = getParameter("card_id")
  var form_id = getParameter("form_id")
  var product_id = getParameter("product_id");
  var user_obj = JSON.parse(localStorage.getItem("user_data"));
  var user_id = user_obj.data[0].id;
  
  $.ajax({
    method: "POST",
    url: BASE_URL+"api/make_order",
    contentType: "application/json;charset=utf-8",
    cache:false,
    data: JSON.stringify({ formdata: JSON.stringify(postarr), user_id: user_id, card_id:card_id, form_id:form_id,product_id:product_id, formData:formData})
  })
  .done(function( msg ) {
    alert( "Data Saved: " + msg );
  });
  console.log(JSON.stringify(postarr))
}
    var form_id = getParameter("form_id")
    // $.ajax({
    //   method: "GET",
    //   url: "http://35.231.117.216:8080/api/frontend/form?id="+form_id,
    //   contentType: "application/json;charset=utf-8",
    //   cache:false
    // })
    // .done(function( data ) {
    //   window.sessionStorage.setItem('formData', JSON.stringify(data.data.data));
    //   //alert( "data: " + JSON.stringify(data.data.data));
    // });

function submitFrom(form_submit_status){
  FORM_SUBMIT = form_submit_status;
  
  jQuery(".render-wrap").submit();  
  
  
}

function editFrom(){
  $(".previewForm").hide('fade');
  $(".contackForm").show('fade');
}

function inArray(needle, haystack) {
    var length = haystack.length;
    for(var i = 0; i < length; i++) {
        if(haystack[i] == needle) return true;
    }
    return false;
}
$(document).ready(function() {
  jQuery("body").on("change",".is_music",function(){
    var ext = $(this).val().split('.').pop().toLowerCase();
      if($.inArray(ext, ['mp3']) == -1) {
        alert('invalid extension!');
    }
  })
    

jQuery("body").on("click",".add-more-btn",function(){
  var eventHTML = "";

  var elmPrefix = $(this).attr('name');
  console.log(elmPrefix);
  
  var repeatVal = jQuery("#"+elmPrefix+"-repeat").val();
  
  console.log(jQuery("[name^="+elmPrefix+"]"))  
  var lastObject;
  var master_id ;
  var lastPrefix;
  if(repeatVal >=1){
  jQuery("[name^="+elmPrefix+"]").each(function( index ) {
    var htmlContent = '';
    if($(this).attr("name").indexOf("preview") == -1 && $( this ).text().toLowerCase().indexOf("add") == -1)
    {
      if($(this).attr("name").indexOf("repeat") == -1){
        if($(this).attr("name").indexOf("_1") != -1){
          // Clone it and assign the new ID (i.e: from num 4 to ID "klon4")
          var $div = $(this);
          var labelText = $(this).prev('label').html();
          var lableClass = $(this).prev('label').attr('class');
          var parentDiv = $(this).parent('div').attr('class');

          console.log(parentDiv);
          var nameArr = $(this).attr('name').split("_");
          var $klon = $div.clone().prop('name', nameArr[0]+"_"+repeatVal);
          $klon = $klon.clone().prop("id", nameArr[0]+"_"+repeatVal);
          $klon = $klon.clone().prop("value", "");
          // Finally insert $klon wherever you want
          //$div.after( $klon);
          master_id = repeatVal;
          lastPrefix = elmPrefix;
          htmlContent += '<div class="'+parentDiv+'">';
          htmlContent += '<label for="'+nameArr[0]+"_"+repeatVal+'" class="'+lableClass+'">'+labelText+'</label>';
          htmlContent += $("<div >").append($klon).html();
          htmlContent += '</div>';
          console.log(htmlContent)
          $('#tmp_div').append(htmlContent);
          jQuery("#"+elmPrefix+"-repeat").val(repeatVal - 1)
          lastObject = $(this).parent('div');
        }
      }

    }
  });
  var divObj = '<div class="new-block master-child-'+master_id+'">'+$('#tmp_div').html()+'<span id="delete_add_more" style="cursor:pointer" prefix="'+lastPrefix+'" delete-attr="master-child-'+master_id+'">Delete this block</span></div>';
  $(lastObject).after(divObj)
  $('#tmp_div').html('')
  }else{
    alert("For adding more blocks please contact to administrator!");
  }
})
  jQuery("body").on("click","#delete_add_more",function(){ 
    var removeChild = $(this).attr("delete-attr");
    $("."+removeChild).remove();
    var prefixDiv = $(this).attr('prefix');
    jQuery("#"+prefixDiv+"-repeat").val(parseInt(jQuery("#"+prefixDiv+"-repeat").val()) + 1)

  })
  var restrictArr = new Array;
    //option A
  jQuery(".render-wrap").submit(function(e){
    var inputs = $(".render-wrap input, .render-wrap select");
    var myFormData = new FormData();
    var i = 0;
    var isValidate = 1;
    $.each(inputs, function (obj, v) {
      if($(v).attr('type') == 'file'){
      var file = v.files[0];
      var filename = $(v).attr("name");
      var name = $(v).attr("id");
      myFormData.append(filename,file);
      i++;
      }
      $(v).css('border','');
      if($(v).attr('required')){
        if($(v).attr('type') == 'radio'){
          var inputname = $(v).attr('name');
          var is_checked = jQuery("input[name="+inputname+"]:checked").val();
          console.log(is_checked);
          if(!is_checked) {

            isValidate = 0;
          }
        }else{
          if($(v).val()==''){

            $(v).css('border','2px solid red');
            isValidate = 0;  
          }  
        }
        
        
      }
    }); 
    console.log(isValidate)
     e.preventDefault();

    if(isValidate == 1){
    var user_obj = JSON.parse(localStorage.getItem("user_data"));
    var user_id = user_obj.data[0].id;

    var card_id = getParameter("card_id")
    var form_id = getParameter("form_id")
    var product_id = getParameter("product_id");

    myFormData.append("card_id",card_id);
    myFormData.append("form_id",form_id);
    myFormData.append("product_id",product_id);
    myFormData.append("user_id",user_id);

    //console.log(myFormData);
      //var form = $(".render-wrap");
      //console.log(form.serialize())
      if( window.FormData !== undefined ) {

        var form = document.getElementsByClassName("render-wrap");
        //console.log(this)
        // you can't pass Jquery form it has to be javascript form object
        var formData = new FormData(this);
        var serialData = jQuery(".render-wrap").serialize();
        //$('.loader-overlay').show(); 
        var prevHTML = '';
        var accessObj = [];
        $.each(inputs, function (obj, v) {

          var objValue = '';
          var objLabel = '';
          var objName = $(v).attr('name');
          var objClass = $(v).attr('class');
          if($(v).attr('type')=='radio' || $(v).attr('type')=='checkbox'){
            
            objValue = $("[name='"+objName+"']:checked").next('label').html();
            objLabel = $("[name='"+objName+"']").parent().parent().parent().children('label').html()
          }else{
            objValue = $(v).val();
            objLabel = $(v).prev('label').prop('outerHTML')
          }

          var htmlObj = '<div class="col-md-12">'+objLabel+" : "+objValue+'</div>'; 
          if(($("#is_music").val() == 'default' || $("#is_music").val() == 'nomusic') && (objName == 'youtubelink' || objClass == 'is_music')){
            htmlObj = '';
          }else if($("#is_music").val() == 'ytube' && (objClass == 'is_music')){
            htmlObj = '';
          }else if($("#is_music").val() == 'own' && (objName == 'youtubelink')){
            htmlObj = '';
          }
          if(inArray(objName,accessObj)){
             htmlObj = ''; 
          }

          if(objName == 'undefined'){
            htmlObj = '';
          }

          accessObj[accessObj.length] = objName;
          prevHTML +=htmlObj;

        }); 
        $("#preview-form-div").html(prevHTML);
        $(".contackForm").hide('fade');
        $(".previewForm").show('fade');
        //console.log(prevHTML);
        if(FORM_SUBMIT == 1){
          $('.loader-overlay').show(); 
          $.ajax({
            processData: false,
            contentType: false,
            method: "POST",
            url: BASE_URL+"api/make_order?"+serialData,
            data:myFormData
          })
          .done(function( data ) {
            //alert( "Data Saved: " + msg.message );
            //console.log(data);
            $("#ORDER_ID").val(data.data.order_id);
            $("#CUST_ID").val(data.data.user_id);
            $("#TXN_AMOUNT").val(data.data.price);
            $("#paymentfrom").submit();
            //window.location = SITE_URL+"thankyou.html";
          });  
        }else if(FORM_SUBMIT == 2){
          order_id = getParameter('order_id')
          myFormData.append("order_id",order_id);
          $('.loader-overlay').show(); 
          $.ajax({
            processData: false,
            contentType: false,
            method: "POST",
            url: BASE_URL+"api/update_order?"+serialData,
            data:myFormData
          })
          .done(function( data ) {
            window.location = SITE_URL+"thankyou.html";
          });
        }
        
          //console.log(formData);
         
          
      }
    }else{
      alert("please fill required fields")
    }
    })

    jQuery("body").on('change',"[name=is_music]", function(){
      if(jQuery(this).val() == 'ytube'){
        jQuery(".field-youtubelink").css("display","block");
        jQuery(".is_music").parent('.fb-file').css("display","none");
      }else if(jQuery(this).val() == 'own'){
        jQuery(".field-youtubelink").css("display","none");
        jQuery(".is_music").parent('.fb-file').css("display","block");
      }else{
        jQuery(".field-youtubelink").css("display","none");
        jQuery(".is_music").parent('.fb-file').css("display","none");
      }
    })
});
jQuery(function($) {
  if(getParameter('order_id'))
  {
  
    //console.log("Dasdas");
  }
getData(getParameter('form_id'), function(){
  var fields = [
    {
      type: 'autocomplete',
      label: 'Custom Autocomplete',
      required: true,
      values: [
        {label: 'SQL'},
        {label: 'C#'},
        {label: 'JavaScript'},
        {label: 'Java'},
        {label: 'Python'},
        {label: 'C++'},
        {label: 'PHP'},
        {label: 'Swift'},
        {label: 'Ruby'}
      ]
    },
    {
      label: 'Star Rating',
      attrs: {
        type: 'starRating'
      },
      icon: '🌟'
    }
  ];

  var replaceFields = [
    {
      type: 'textarea',
      subtype: 'tinymce',
      label: 'tinyMCE',
      required: true,
    }
  ];

  var actionButtons = [{
    id: 'smile',
    className: 'btn btn-success',
    label: '😁',
    type: 'button',
    events: {
      click: function() {
        alert('😁😁😁 !SMILE! 😁😁😁');
      }
    }
  }];

  var templates = {
    starRating: function(fieldData) {
      return {
        field: '<span id="'+fieldData.name+'">',
        onRender: function() {
          $(document.getElementById(fieldData.name)).rateYo({rating: 3.6});
        }
      };
    }
  };

  var inputSets = [{
        label: 'User Details',
        icon: '👨',
        name: 'user-details', // optional
        showHeader: true, // optional
        fields: [{
          type: 'text',
          label: 'First Name',
          className: 'form-control'
        }, {
          type: 'select',
          label: 'Profession',
          className: 'form-control',
          values: [{
            label: 'Street Sweeper',
            value: 'option-2',
            selected: false
          }, {
            label: 'Brain Surgeon',
            value: 'option-3',
            selected: false
          }]
        }, {
          type: 'textarea',
          label: 'Short Bio:',
          className: 'form-control'
        }]
      }, {
        label: 'User Agreement',
        fields: [{
          type: 'header',
          subtype: 'h3',
          label: 'Terms & Conditions',
          className: 'header'
        }, {
          type: 'paragraph',
          label: 'Leverage agile frameworks to provide a robust synopsis for high level overviews. Iterative approaches to corporate strategy foster collaborative thinking to further the overall value proposition. Organically grow the holistic world view of disruptive innovation via workplace diversity and empowerment.',
        }, {
          type: 'paragraph',
          label: 'Bring to the table win-win survival strategies to ensure proactive domination. At the end of the day, going forward, a new normal that has evolved from generation X is on the runway heading towards a streamlined cloud solution. User generated content in real-time will have multiple touchpoints for offshoring.',
        }, {
          type: 'checkbox',
          label: 'Do you agree to the terms and conditions?',
        }]
      }];

  var typeUserDisabledAttrs = {
    autocomplete: ['access']
  };

  var typeUserAttrs = {
    text: {
      className: {
        label: 'Class',
        options: {
          'red form-control': 'Red',
          'green form-control': 'Green',
          'blue form-control': 'Blue'
        },
        style: 'border: 1px solid red'
      }
    }
  };

  // test disabledAttrs
  var disabledAttrs = ['placeholder'];

  var fbOptions = {
    subtypes: {
      text: ['datetime-local']
    },
    onSave: function(e, formData) {
      toggleEdit();
//  if(window.sessionStorage.getItem("formData")){
//    formData = window.sessionStorage.getItem("formData");
//  }
//  console.log(formData)
  //    console.log(templates);
      $('.render-wrap').formRender({
        formData: formData,
        templates: templates
      });

     // window.sessionStorage.setItem('formData', JSON.stringify(formData));
    },
    stickyControls: {
      enable: true
    },
    sortableControls: true,
    fields: fields,
    templates: templates,
    inputSets: inputSets,
    typeUserDisabledAttrs: typeUserDisabledAttrs,
    typeUserAttrs: typeUserAttrs,
    disableInjectedStyle: false,
    actionButtons: actionButtons,
    disableFields: ['autocomplete'],
    replaceFields: replaceFields,
    disabledFieldButtons: {
      text: ['copy']
    }
    // controlPosition: 'left'
    // disabledAttrs
  };
  var formData = window.sessionStorage.getItem('formData');
  var editing = true;

  if (formData) {
    fbOptions.formData = JSON.parse(formData);
  }

  /**
   * Toggles the edit mode for the demo
   * @return {Boolean} editMode
   */
  function toggleEdit() {
    document.body.classList.toggle('form-rendered', editing);
    return editing = !editing;
  }

  var setFormData = '[{"type":"text","label":"Full Name","subtype":"text","className":"form-control","name":"text-1476748004559"},{"type":"select","label":"Occupation","className":"form-control","name":"select-1476748006618","values":[{"label":"Street Sweeper","value":"option-1","selected":true},{"label":"Moth Man","value":"option-2"},{"label":"Chemist","value":"option-3"}]},{"type":"textarea","label":"Short Bio","rows":"5","className":"form-control","name":"textarea-1476748007461"}]';

  var formBuilder = $('.build-wrap').formBuilder(fbOptions);
  var fbPromise = formBuilder.promise;

  fbPromise.then(function(fb) {
    var apiBtns = {
      showData: fb.actions.showData,
      clearFields: fb.actions.clearFields,
      getData: function() {
        //document.getElementById('form-data').value = fb.actions.getData()
        localStorage.setItem('form-data',JSON.stringify(fb.actions.getData()));
        $.ajax({
          method: "POST",
          url: BASE_URL+"master/add/form_builder",
          contentType: "application/json;charset=utf-8",
          data: JSON.stringify({ data: JSON.stringify(fb.actions.getData()), title:jQuery("#title").val()})
        })
        .done(function( msg ) {
          alert( "Data Saved: " + msg );
        });
        //console.log(fb.actions.getData());
      },
      setData: function() {
        fb.actions.setData(setFormData);
      },
      addField: function() {
        var field = {
            type: 'text',
            class: 'form-control',
            label: 'Text Field added at: ' + new Date().getTime()
          };
        fb.actions.addField(field);
      },
      removeField: function() {
        fb.actions.removeField();
      },
      testSubmit: function() {
        var formData = new FormData(document.forms[1]);
        //console.log('Can submit: ', document.forms[1].checkValidity());
        // Display the key/value pairs
        //console.log('FormData:', formData);
        var postarr = new Array;
        for(var pair of formData.entries()) {
            postarr.push(pair);
           //console.log(pair[0]+ ': '+ pair[1]);
        }
        //console.log(JSON.stringify(postarr))
      },
      resetDemo: function() {
        window.sessionStorage.removeItem('formData');
        location.reload();
      }
    };

    Object.keys(apiBtns).forEach(function(action) {
      document.getElementById(action)
      .addEventListener('click', function(e) {
        apiBtns[action]();
      });
    });

    document.getElementById('setLanguage')
    .addEventListener('change', function(e){
      fb.actions.setLang(e.target.value);
    });

    document.getElementById('getXML').addEventListener('click', function() {
      alert(formBuilder.actions.getData('xml'));
    });
    document.getElementById('getJSON').addEventListener('click', function() {
      alert(formBuilder.actions.getData('json', true));
    });
    document.getElementById('getJS').addEventListener('click', function() {
      alert('check console');
      console.log(formBuilder.actions.getData());
    });
  });

  document.getElementById('edit-form').onclick = function() {
    toggleEdit();
  };
  
  // setTimeout(function(){
  //   toggleEdit();
  //   formData = window.sessionStorage.getItem('formData')
  //   $('.render-wrap').formRender({
  //       formData: formData,
  //       templates: templates
  //   });

  // }, 2000)

});
  setTimeout(function(){
    
    jQuery(".field-youtubelink").css("display","none");  
  }, 3000);
  setTimeout(function(){
    
    jQuery(".is_music").parent('.fb-file').css("display","none");  
  }, 3000);
  setTimeout(function(){
    
    jQuery("[name$=-repeat]").parent(".fb-text").css("display","none") 
    jQuery("[name*=time]").attr('type','time');
    //jQuery(".field-repeat").css("display","none");  
  }, 3000);
  $(".render-wrap").attr('enctype','multipart/form-data');

  setTimeout(function(){
  if(getParameter('order_id')){
    console.log("Dasdas")
    var e_product_id = getParameter('card_id')
    var order_id = getParameter('order_id')
    getCardData(e_product_id,order_id, function(data){
      var inputs = $(".render-wrap input, .render-wrap select");
      data = JSON.parse(data);
      $.each(inputs, function (obj, v) {
        var objName = $(v).attr("name");
        $(v).val(data[objName]);
        if(!$(v).attr('type')){
          $(v).trigger('change')  
        }
        
        console.log(data[objName]);
      }); 
    });
  }
  },3000);

});

