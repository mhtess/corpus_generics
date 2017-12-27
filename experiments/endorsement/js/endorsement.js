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

      $("#multi_slider_instructions").append('<tr class="slider_row"><td class="slider_target" id="instructsentence1">Birds that lay eggs.' +
      '</td><td colspan="2"><div id="instructslider1" class="slider">-------[ ]--------</div></td></tr>');

      utils.match_row_height("#multi_slider_instructions", ".slider_target");

      this.init_sliders();

      var label = "#instructslider1";
      $(label+ ' .ui-slider-handle').show();
      $(label).slider({value:0.5});
      $(label).css({"background":"#99D6EB"});
      $(label + ' .ui-slider-handle').css({
        "background":"#667D94",
        "border-color": "#001F29"
      })
      $(label).unbind("mousedown");

   },

   init_sliders : function() {
      utils.make_slider("#instructslider1")
   },
   button : function() {
     this.rt = Date.now() - this.startTime;
     exp.catch_trials.push({
       "instructions_reading_time": this.rt,
       "section": "ismplied_prevalence"
     });

     exp.go(); //use exp.go() if and only if there is no "present" data.
   }
 })

  slides.endorsement = slide({
    name: "endorsement",
    trial_num: 1,
    present: exp.stimuli,

    present_handle : function(stim) {
      $('input[name="speaker"]').prop('checked', false);

      this.startTime = Date.now()
      this.stim =  stim;
      this.allZeros = 1;
      this.hypothetical = 0;
      this.askDirect = 0;

      var generic = stim;
	    var contexthtml = format_context(generic.Context),
	        usentence = generic.Sentence.replace(generic.NP + " " +generic.VP, "<u>" + generic.NP + " " +generic.VP + "</u>");
      $(".case").html(contexthtml + " " + usentence); // Replace .Sentence with the name of your sentence column

      $(".prompt").html(
        "Suppose that, in reality, " +
         this.stim.prevalence +
        "% of " + this.stim.NP+ ' "' + this.stim.VP + '".<br><em>Please read the dialogue to better understand what is meant by the underlined phrase.</em><br><strong>Would you agree or disagree with the underlined phrase?</strong><br>')

      $(".err").hide();
    },

    button : function() {
      var speakerResponse = $('input[name="speaker"]:checked').val();

      var freqs = [], intervals = [];

      // check if all fields are filled
      if (speakerResponse) {
            this.log_responses();
            exp.stimcounter++;
            _stream.apply(this);
      } else {
        $(".err").show();
      }

    },

    log_responses : function() {
      response = $('input[name="speaker"]:checked').val() == "Yes" ?  1 : 0;

      var rt = Date.now() - this.startTime;
      for(i=0; i<exp.n_entities; i++){
        exp.data_trials.push({
          "trial_type" : "endorsement",
          "tgrep_id" : this.stim.Item_ID,
          "trial_num" : this.trial_num,
          "noun_phrase" : this.stim.NP,
          "verb_phrase" : this.stim.VP,
          "verb" : this.stim.Verb,
          "NP_singular": this.stim.NP_singular,
          "VP_singular": this.stim.VP_singular,
          "singular_sentence": this.stim.NP_singular + " that " + this.stim.VP_singular,
          "entire_sentence" : this.stim.Sentence,
          "context" : this.stim.Context,
          "prevalence": this.stim.prevalence,
          "response" : response,
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

  repeatWorker = false;
  (function(){
      var ut_id = "corpgen-preval-20171212";
      if (UTWorkerLimitReached(ut_id)) {
        $('.slide').empty();
        repeatWorker = true;
        alert("You have already completed the maximum number of HITs allowed by this requester. Please click 'Return HIT' to avoid any impact on your approval rating.");
      }
  })();

  exp.n_entities = 1;
  exp.names = [];
  exp.all_names = [];
  exp.trials = [];
  exp.catch_trials = [];
  var stimuli0 = generate_stim(19, true);

  var frequencies = [
    5, 8, 11, 13, 15, 15,
    25, 28, 31, 33, 35, 35,
    55, 58, 61, 63, 65, 65,
  ];

  var shuffledFrequencies = _.shuffle(frequencies)
  shuffledFrequencies.push(_.sample(frequencies))

  var stimuli = []
  for (s=0; s<stimuli0.length; s++){
    var stim = stimuli0[s];
    var prevalence = shuffledFrequencies.pop()
    stimuli.push(_.extend(stim, {prevalence}))
  }

  exp.stimuli = stimuli.slice();
  exp.n_trials = exp.stimuli.length;
  // console.log(exp.stimuli)
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
    "endorsement",
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
