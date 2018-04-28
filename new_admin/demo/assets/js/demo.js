jQuery(function($) {
  if(window.sessionStorage.getItem('formData')){
    window.sessionStorage.removeItem('formData');
  }
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
    },

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
        label: 'Event Details',
        icon: '👨',
        name: 'event-details', // optional
        showHeader: true, // optional
        fields: [{
          type: 'button',
          label: 'Add more',
          className : 'add-more-btn'
        },{
          "type": "text",
          "required": true,
          "label": "Repeat",
          "placeholder": "Repeat",
          "name": "repeat",
          "subtype": "text",
          "className": "red form-control"
        }]
      }, {
        label: 'Soundtrack',
        icon: '👨',
        name: 'card-music', // optional
        showHeader: false, // optional
        fields: [{
          type: 'header',
          subtype: 'h3',
          label: 'Soundtrack',
          className: 'header'
        }, {
          type: 'select',
          label: 'Upload Soundtrack',
          className: 'form-control',
          name : "is_music",
          values: [{
            label: 'Default',
            value: 'default',
            selected: false
          }, {
            label: 'Youtube Link',
            value: 'ytube',
            selected: false
          }, {
            label: 'Upload MP3 File',
            value: 'own',
            selected: false
          }, {
            label: 'No Music',
            value: 'nomusic',
            selected: false
          }]
        }, {
          type: 'text',
          name: 'youtubelink',
          placeholder:'Youtube Link',
          label: 'Youtube Link',
          className : 'is_music'
        }, {
          type: 'file',
          label: 'Upload Your Own Video Mp3',
          className : 'is_music',
          
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
      text: ['time']
    },
    onSave: function(e, formData) {
      toggleEdit();
      $('.render-wrap').formRender({
        formData: formData,
        templates: templates
      });
      window.sessionStorage.setItem('formData', JSON.stringify(formData));
      
	//localStorage.setItem('form-data',JSON.stringify(fb.actions.getData()));
      $.ajax({
          method: "POST",
          url: "http://35.231.117.216:8080/master/add/form_builder",
          contentType: "application/json;charset=utf-8",
          data: JSON.stringify({ data:JSON.stringify(formData) , title:jQuery("#title").val()})
        })
        .done(function( msg ) {
          alert( "Data Saved: " + msg );
        });

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
          url: "http://35.231.117.216:8080/master/add/form_builder",
          contentType: "application/json;charset=utf-8",
          data: JSON.stringify({ data: JSON.stringify(fb.actions.getData()), title:jQuery("#title").val()})
        })
        .done(function( msg ) {
          alert( "Data Saved: " + msg );
        });
        console.log(fb.actions.getData());
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
        var formData = new FormData(document.forms[0]);
        console.log('Can submit: ', document.forms[0].checkValidity());
        // Display the key/value pairs
        console.log('FormData:', formData);
        var postarr = new Array;
        for(var pair of formData.entries()) {
            postarr.push(pair);
           console.log(pair[0]+ ': '+ pair[1]);
        }
        console.log(JSON.stringify(postarr))
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
});
