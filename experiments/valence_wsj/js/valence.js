var number_of_generic_trials = 25;
var trialcounter = 0;
var ordering_flag = 0;
var generics = [];

function make_slides(f) {
  var   slides = {};

  slides.i0 = slide({
     name : "i0",
     start: function() {
      exp.startT = Date.now();
     }
  });

  slides.instructions = slide({
    name : "instructions",
    button : function() {
      exp.go(); //use exp.go() if and only if there is no "present" data.
    }
  });

  slides.example_series = slide({
    name : "example_series",

    /* trial information for this block
     (the variable 'stim' will change between each of these values,
      and for each of these, present_handle will be run.) */
    present : training_generics,

    //this gets run only at the beginning of the block
    present_handle : function(stim) {
	$(".err").hide();
    $("#practice_wrong_answer").hide();
	this.generic = stim;
	var generic = stim;
	var contexthtml = this.format_context(generic.Context);
	usentence = generic.Sentence.replace(generic.VP, "<u>" + generic.VP + "</u>");
	$(".case").html(contexthtml + " " + usentence); // Replace .Sentence with the name of your sentence column
	this.question = "From very bad to very good, how good is it to have the underlined property?";
    option_text_1 = "<b>Very Bad</b>";
    option_text_2 = "<b>Very Good</b>";
    
    if (ordering_flag == 0) {
	 $('#practice_left_bound').html(option_text_1);
	 $('#practice_right_bound').html(option_text_2);
    exp.rightSide = "P";
  } else {
    $('#practice_left_bound').html(option_text_2);
   $('#practice_right_bound').html(option_text_1);
    exp.rightSide = "N";
  }
	$(".question").html(this.question);
	exp.responseValue = null;

    this.init_numeric_sliders();
    $(".slider_number").hide();
    //$(".slider_number").html("--");
    exp.sliderPost = null;

    },

    button : function() {
    $(".err").hide();
	if (exp.sliderPost  == null) {
            $(".err").show();
	} else if (((exp.sliderPost <= 0.5) && (this.generic.Correct == "P")) || ((exp.sliderPost >= 0.5) && (this.generic.Correct == "N"))) {
            $("#practice_wrong_answer").show();
    } else {
            this.log_responses();
        /* use _stream.apply(this); if and only if there is
        "present" data. (and only *after* responses are logged) */
            _stream.apply(this);
	}
    },

    init_sliders : function() {
      utils.make_slider("#practice_single_slider", function(event, ui) {
        exp.responseValue = ui.value;
      });
    },

    init_numeric_sliders : function() {
        utils.make_slider("#practice_single_slider", this.make_slider_callback());
    },

    make_slider_callback : function() {
      return function(event, ui) {
        exp.sliderPost = ui.value;
        exp.responseValue = ui.value;
        $(".slider_number").html(Math.round(exp.sliderPost*100) + "%");
      };
    },

    format_context : function(context) {
        contexthtml = context.replace(/###speakera(\d+)./g, "<br><b>Speaker #1:</b>");
        contexthtml = contexthtml.replace(/###speakerb(\d+)./g, "<br><b>Speaker #2:</b>");
        contexthtml = contexthtml.replace(/###/g, " ");
        if (!contexthtml.startsWith("<br><b>Speaker #")) {
            var ssi = contexthtml.indexOf("Speaker #");
            switch(contexthtml[ssi+"Speaker #".length]) {
            case "1":
                contexthtml = "<br><b>Speaker #2:</b> " + contexthtml;
                break;
            case "2":
                contexthtml = "<br><b>Speaker #1:</b> " + contexthtml;
                break;
            default:
                break;
            }
        };
        return contexthtml;
    },

    log_responses : function() {
      exp.catch_trials.push({
        "trial_type" : "single_generic_trial",
	"question" : this.question,
	"focus" : exp.responseValue,
	"tgrep id" : this.generic.Item_ID,
	"noun phrase" : this.generic.NP,
	"verb phrase" : this.generic.VP,
	"verb" : this.generic.Verb,
	"entire sentence" : this.generic.Sentence,
    "context" : this.generic.Context,
    "correct" : this.generic.Correct,
  "right_side" : exp.rightSide
      });
    }

  });

  slides.trial_series = slide({
    name : "trial_series",

    /* trial information for this block
     (the variable 'stim' will change between each of these values,
      and for each of these, present_handle will be run.) */
    present : generics,

    //this gets run only at the beginning of the block
    present_handle : function(stim) {
	$(".err").hide();
	this.generic = stim;
	var generic = stim;
	var contexthtml = this.format_context(generic.Context);
	usentence = generic.Sentence.replace(generic.VP, "<u>" + generic.VP + "</u>");
	$(".case").html(contexthtml + " " + usentence); // Replace .Sentence with the name of your sentence column
	this.question = "From very bad to very good, how good is it to have the underlined property?";
    option_text_1 = "<b>Very Bad</b>";
    option_text_2 = "<b>Very Good</b>";
    
    if (ordering_flag == 0) {
	 $('#left_bound').html(option_text_1);
	 $('#right_bound').html(option_text_2);
    exp.rightSide = "VP";
  } else {
    $('#left_bound').html(option_text_2);
   $('#right_bound').html(option_text_1);
    exp.rightSide = "NP";
  }
	$(".question").html(this.question);
	exp.responseValue = null;

    this.init_numeric_sliders();
    $(".slider_number").hide();
    //$(".slider_number").html("--");
    exp.sliderPost = null;
    },

    button : function() {
	if (exp.sliderPost  == null) {
            $(".err").show();
	} else {
            this.log_responses();
        /* use _stream.apply(this); if and only if there is
        "present" data. (and only *after* responses are logged) */
            _stream.apply(this);
	}
    },

    init_sliders : function() {
      utils.make_slider("#single_slider", function(event, ui) {
        exp.responseValue = ui.value;
      });
    },

    init_numeric_sliders : function() {
        utils.make_slider("#single_slider", this.make_slider_callback());
    },

    make_slider_callback : function() {
      return function(event, ui) {
        exp.sliderPost = ui.value;
        exp.responseValue = ui.value;
        $(".slider_number").html(Math.round(exp.sliderPost*100) + "%");
      };
    },

    format_context : function(context) {
        contexthtml = context.replace(/###speakera(\d+)./g, "<br><b>Speaker #1:</b>");
        contexthtml = contexthtml.replace(/###speakerb(\d+)./g, "<br><b>Speaker #2:</b>");
        contexthtml = contexthtml.replace(/###/g, " ");
        if (!contexthtml.startsWith("<br><b>Speaker #")) {
            var ssi = contexthtml.indexOf("Speaker #");
            switch(contexthtml[ssi+"Speaker #".length]) {
            case "1":
                contexthtml = "<br><b>Speaker #2:</b> " + contexthtml;
                break;
            case "2":
                contexthtml = "<br><b>Speaker #1:</b> " + contexthtml;
                break;
            default:
                break;
            }
        };
        return contexthtml;
    },

    log_responses : function() {
      exp.data_trials.push({
        "trial_type" : "single_generic_trial",
	"question" : this.question,
	"valence" : exp.responseValue,
	"tgrep id" : this.generic.Item_ID,
	"noun phrase" : this.generic.NP,
	"verb phrase" : this.generic.VP,
	"verb" : this.generic.Verb,
	"entire sentence" : this.generic.Sentence,
    "context" : this.generic.Context,
  "right_side" : exp.rightSide
      });
    }
  });


   slides.subj_info =  slide({
    name : "subj_info",
    submit : function(e){
      //if (e.preventDefault) e.preventDefault(); // I don't know what this means.
      exp.subj_data = {
        language : $("#language").val(),
        enjoyment : $("#enjoyment").val(),
        asses : $('input[name="assess"]:checked').val(),
        age : $("#age").val(),
        gender : $("#gender").val(),
        education : $("#education").val(),
        comments : $("#comments").val(),
      };
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
      var ut_id = "corpgen-valence-061117-2";
      if (UTWorkerLimitReached(ut_id)) {
        $('.slide').empty();
        repeatWorker = true;
        alert("You have already completed the maximum number of HITs allowed by this requester. Please click 'Return HIT' to avoid any impact on your approval rating.");
      }
  })();

  training_generics = generate_training_stim(2);
  generics = generate_stim(number_of_generic_trials, false);
  //ordering_flag = Math.floor(Math.random() * 2);
  ordering_flag = 0;
  for (var i = generics.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = generics[i];
      generics[i] = generics[j];
      generics[j] = temp;
  }
  exp.trials = [];
  exp.catch_trials = [];
  exp.condition = _.sample(["CONDITION 1", "condition 2"]); //can randomize between subject conditions here
  exp.system = {
      Browser : BrowserDetect.browser,
      OS : BrowserDetect.OS,
      screenH: screen.height,
      screenUH: exp.height,
      screenW: screen.width,
      screenUW: exp.width
    };
  //blocks of the experiment:
  exp.structure=["i0", "instructions", "example_series", "trial_series", 'subj_info', 'thanks'];

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
