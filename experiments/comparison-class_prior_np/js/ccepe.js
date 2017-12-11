function make_slides(f) {
  var slides = {};

  slides.i0 = slide({
     name : "i0",
     start: function() {
      $("#n_trials").html(exp.n_trials);
      exp.startT = Date.now();
     }
  });

  slides.instructions = slide({
    name : "instructions",
    start: function() {
      this.startTime = Date.now();
      $(".NP").html("Birds");
      $(".comparison_class_singular").html("animal");
      $(".n_entities").html("3");
      $(".comparison_class_plural").html("animals");
       //$(".n_entities").html(exp.n_entities);
       //$(".n_items").html(exp.n_trials);
   },
    button : function() {
      this.rt = Date.now() - this.startTime;
      exp.catch_trials.push({"instructions_reading_time": this.rt});

      exp.go(); //use exp.go() if and only if there is no "present" data.
    }
  });

  slides.priors_instructions = slide({
    name : "priors_instructions",
    start: function() {
      this.startTime = Date.now();

      var instructCategories = [
        {kind: "Dogs", prev: 0.01},
        {kind:"Cats", prev: 0.01},
        {kind: "Fish", prev: 0.5}
      ]

      for(i=0; i<3; i++){

        $("#multi_slider_instructions").append('<tr class="slider_row"><td class="slider_target" id="instructsentence' + i + '"><strong>' + instructCategories[i].kind + "</strong> that lay eggs." +
        '</td><td colspan="2"><div id="instructslider' + i + '" class="slider">-------[ ]--------</div></td></tr>');

        utils.match_row_height("#multi_slider_instructions", ".slider_target");
      }

      this.init_sliders();

      for(i=0; i<3; i++){
        var label = "#instructslider" + i;
        $(label+ ' .ui-slider-handle').show();
        $(label).slider({value:instructCategories[i].prev});
        $(label).css({"background":"#99D6EB"});
        $(label + ' .ui-slider-handle').css({
          "background":"#667D94",
          "border-color": "#001F29"
        })
        $(label).unbind("mousedown");

      }

   },

   init_sliders : function() {
       for (i=0; i<3; i++) {
           utils.make_slider("#instructslider" + i)
       }
   },

    button : function() {
      this.rt = Date.now() - this.startTime;
      exp.catch_trials.push({"instructions2_reading_time": this.rt});
      exp.go(); //use exp.go() if and only if there is no "present" data.
    }
  });


  slides.generateEntities = slide({
    name: "generateEntities",
    present: exp.stimuli,

    trial_num : 1,
    present_handle : function(stim) {

      this.startTime = Date.now();

      this.counter = 1;

      var generic = stim;
      this.generic = generic;
	    var contexthtml = format_context(generic.Context),
	        usentence = generic.Sentence.replace(generic.NP, "<u>" + generic.NP + "</u>");
      $(".case").html(contexthtml + " " + usentence); // Replace .Sentence with the name of your sentence column

      $(".NP").html(generic.NP.charAt(0).toUpperCase() + generic.NP.slice(1));
      $(".comparison_class_singular").html(generic.CCNS);
      $(".comparison_class_plural").html(generic.CCNP);

      $(".n_entities").html(exp.n_entities);

      $(".err").hide();

      $("#entityTable").empty();
      var newTextBoxDiv = $(document.createElement('div'))
           .attr("id", 'TextBoxDiv' + this.counter);
      newTextBoxDiv.after().html('<label>Example #'+ this.counter + ' : </label>' +
            '<input type="text" name="textbox' + this.counter +
            '" id="textbox' + this.counter + '" value="" size="50">');

      newTextBoxDiv.appendTo("#entityTable");
      $("#textbox"+ this.counter).focus()

      this.counter++;
      $(document).one("keydown", _s.keyPressHandler);

    },

    keyPressHandler : function(event) {
      var keyCode = event.which;

      if (keyCode != 13) {
        // If a key that we don't care about is pressed, re-attach the handler (see the end of this script for more info)
        $(document).one("keydown", _s.keyPressHandler);
      } else {
        // If a valid key is pressed (code 80 is p, 81 is q),
          // _s.rt = Date.now() - _s.startTime;
          // _s.log_responses(keyCode);

          var response = $('#textbox' + (_s.counter - 1) ).val();
          if (response == "") {
            $(".err").show();
            $(document).one("keydown", _s.keyPressHandler);
          } else {
            $(".err").hide();
            _s.rt = Date.now() - _s.startTime;
            exp.data_trials.push({
              "trial_type" : "comparison_class_elicitation",
            	"tgrep_id" : _s.generic.Item_ID,
              "trial_num": _s.trial_num,
            	"noun_phrase" : _s.generic.NP,
            	"verb_phrase" : _s.generic.VP,
            	"verb" : _s.generic.Verb,
            	"entire_sentence" : _s.generic.Sentence,
              "context" : _s.generic.Context,
              "response" : $('#textbox' + (_s.counter - 1)).val(),
              "rt":_s.rt
            });

            this.startTime = Date.now();

            if (_s.counter > exp.n_entities) {
              _s.trial_num++;

              for(i=1; i<(_s.counter); i++){
                exp.names.push(
                  $('#textbox' + i).val()
                )
              }

              setTimeout(function(){
                exp.all_names.push(exp.names.slice());
                exp.names.length = 0;
                _stream.apply(_s);
              }, 250);
            } else {
              var newTextBoxDiv = $(document.createElement('div'))
                   .attr("id", 'TextBoxDiv' + _s.counter);

              newTextBoxDiv.after().html('<label>Example #'+ _s.counter + ' : </label>' +
                    '<input type="text" name="textbox' + _s.counter +
                    '" id="textbox' + _s.counter + '" value="" size="50">');
              newTextBoxDiv.appendTo("#entityTable");
              $("#textbox"+ _s.counter).focus()
              _s.counter++;
              $(document).one("keydown", _s.keyPressHandler);
              // $(document).next('text').focus();
            }
          }
          /* use _stream.apply(this); if and only if there is
          "present" data. (and only *after* responses are logged) */
        //  setTimeout(function(){_stream.apply(_s)}, 250);
      }
    },

  });

  slides.priors = slide({
    name: "priors",

    present: exp.stimscopy,
    trial_num: 1,

    present_handle : function(stim) {
      this.startTime = Date.now()
      this.stim =  stim;
      this.trialNum = exp.stimcounter;
      this.examples = exp.all_names[this.trial_num - 1];
      this.allZeros = 1;
      this.hypothetical = 0;
      this.askDirect = 0;

      var generic = stim;
	    var contexthtml = format_context(generic.Context),
	        usentence = generic.Sentence.replace(generic.VP, "<u>" + generic.VP + "</u>");
      $(".case").html(contexthtml + " " + usentence); // Replace .Sentence with the name of your sentence column

      $(".prompt").html(
        "For each of the following types of " + this.stim.CCNP + ", how likely is it that they <strong>" + this.stim.VP + "</strong>?<br><em>Please read the dialogue to better understand what is meant by the underlined phrase.</em><br>"
      );
      $(".slider_row").remove();

      // create response table
      for(i=0; i<exp.n_entities; i++){

        $("#multi_slider_table").append('<tr class="slider_row"><td class="slider_target" id="sentence' + i + '"><strong>' +
        this.examples[i] + "</strong>" + " that " + this.stim.VP +
        '</td><td colspan="2"><div id="slider' + i + '" class="slider">-------[ ]--------</div></td></tr>');

        utils.match_row_height("#multi_slider_table", ".slider_target");

      }
      $(".err").hide();
      this.init_numeric_sliders();
      exp.sliderPost = [];
    },


    init_numeric_sliders : function() {
        for (i=0; i<exp.n_entities; i++) {
            // utils.make_slider("#freqbox_response" + i, this.make_slider_callback(i));
            utils.make_slider("#slider" + i, this.make_slider_callback(i));

        }
    },

    make_slider_callback : function(i) {
      return function(event, ui) {
        exp.sliderPost[i] = ui.value;
        // $("#slider_number" + i).html(Math.round(exp.sliderPost[i]*100) + "%");
      };
    },



    button : function() {
      var freqs = [], intervals = [];

      for(i=0; i<exp.n_entities; i++){
        var f = parseInt(exp.sliderPost[i]*100);
        freqs.push(isNaN(f) ? "" : f)
      }

      // check if all fields are filled
      if (freqs.indexOf("") == -1) {
            this.log_responses();
            exp.stimcounter++;
            _stream.apply(this);
      } else {
        $(".err").show();
      }

    },

    log_responses : function() {
      var rt = Date.now() - this.startTime;
      var trialNum = exp.stimscopy.indexOf(this.stim) + 1;
      for(i=0; i<exp.n_entities; i++){
        exp.data_trials.push({
          "trial_type" : "prevalence_prior",
          "tgrep_id" : this.stim.Item_ID,
          "trial_num" : this.trial_num,
          "noun_phrase" : this.examples[i],
          "verb_phrase" : this.stim.VP,
          "verb" : this.stim.Verb,
          "entire_sentence" : this.stim.Sentence,
          "context" : this.stim.Context,
          "response" :exp.sliderPost[i],
          "rt":rt
        })
      }
      this.trial_num++;
    }

  });

  slides.subj_info =  slide({
    name : "subj_info",
    submit : function(e){
      //if (e.preventDefault) e.preventDefault(); // I don't know what this means.
      exp.subj_data = _.extend({
        language : $("#language").val(),
        enjoyment : $("#enjoyment").val(),
        asses : $('input[name="assess"]:checked').val(),
        age : $("#age").val(),
        gender : $("#gender").val(),
        education : $("#education").val(),
        comments : $("#comments").val(),
        problems: $("#problems").val(),
        fairprice: $("#fairprice").val()
      });
      exp.go(); //use exp.go() if and only if there is no "present" data.
    }
  });

  slides.thanks = slide({
    name : "thanks",
    start : function() {
      exp.data= {
          "trials" : exp.data_trials,
          "catch_trials" : exp.catch_trials,
          "system" : exp.system,
          "condition" : exp.condition,
          "subject_information" : exp.subj_data,
          "time_in_minutes" : (Date.now() - exp.startT)/60000
      };
      setTimeout(function() {turk.submit(exp.data);}, 1000);
    }
  });

  return slides;
}

/// init ///
function init() {

  /*repeatWorker = false;
  (function(){
      var ut_id = "mht-hab-priors-20170405";
      if (UTWorkerLimitReached(ut_id)) {
        $('.slide').empty();
        repeatWorker = true;
        alert("You have already completed the maximum number of HITs allowed by this requester. Please click 'Return HIT' to avoid any impact on your approval rating.");
      }
  })();*/

  exp.n_entities = 3;
  exp.names = [];
  exp.all_names = [];
  exp.trials = [];
  exp.catch_trials = [];
  var stimuli = generate_stim(19, true);
  // console.log(stimuli);
  //exp.stimuli = _.shuffle(stimuli).slice(0, 15);
  exp.stimuli = stimuli.slice();
  exp.n_trials = exp.stimuli.length;
  exp.stimcounter = 0;

  // exp.womenFirst = _.sample([true, false])
  // debugger;
  exp.stimscopy = exp.stimuli.slice();

  // exp.condition = _.sample(["CONDITION 1", "condition 2"]); //can randomize between subject conditions here
  exp.system = {
      Browser : BrowserDetect.browser,
      OS : BrowserDetect.OS,
      screenH: screen.height,
      screenUH: exp.height,
      screenW: screen.width,
      screenUW: exp.width
    };
  //blocks of the experiment:
  exp.structure=[
    "i0",
    "instructions",
    "generateEntities",
    "priors_instructions",
    "priors",
    "subj_info",
    "thanks"
  ];

  exp.data_trials = [];
  //make corresponding slides:
  exp.slides = make_slides(exp);

  exp.nQs = utils.get_exp_length(); //this does not work if there are stacks of stims (but does work for an experiment with this structure)
                    //relies on structure and slides being defined

  $('.slide').hide(); //hide everything

  //make sure turkers have accepted HIT (or you're not in mturk)
  $("#start_button").click(function() {
    if (turk.previewMode) {
      $("#mustaccept").show();
    } else {
      $("#start_button").click(function() {$("#mustaccept").show();});
      exp.go();
    }
  });

  exp.go(); //show first slide
}
