var focus_flag = 1;
var number_of_generic_trials = 30;
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

 slides.focus_practice_trial = slide({
    name: "focus_practice_trial",
    start: function() {
      $(".err").hide();
      $(".display_condition").html("You are in " + exp.condition + ".");
      $("input:radio[name=exchange1]").click(function() {
            exp.exchangeOneValue = $(this).val();
            exp.exchangeOneLabel = $(this).next('label:first').text()
      });
      $("input:radio[name=exchange2]").click(function() {
            exp.exchangeTwoValue = $(this).val();
            exp.exchangeTwoLabel = $(this).next('label:first').text()
      });
    },
    button : function() {
      response = $("#text_response").val();
      if (!exp.exchangeOneValue || !exp.exchangeTwoValue) {
        $(".err").show();
      } else {
        exp.catch_trials.push({
          "trial_type" : "focus_practice_trial",
	  "focus" : exp.exchangeOneValue,
	  "response" : exp.exchangeOneLabel
        });
	exp.catch_trials.push({
          "trial_type" : "focus_practice_trial",
          "focus" : exp.exchangeTwoValue,
          "response" : exp.exchangeTwoLabel
        });
        exp.go(); //make sure this is at the *end*, after you log your data
      }
    },
  });

  slides.generic_trial_series = slide({
    name : "generic_trial_series",

    /* trial information for this block
     (the variable 'stim' will change between each of these values,
      and for each of these, present_handle will be run.) */
    present : generics,

    //this gets run only at the beginning of the block
    present_handle : function(stim) {
	$(".err").hide();
	$("#binary").hide();
	$("#textbox").hide();
	$("#rate").hide();
	this.generic = stim;
	var generic = stim;
	var contexthtml = this.format_context(generic.Context);
	bare_plural = generic.NP + " " + generic.VP;
	usentence = generic.Sentence.replace(bare_plural, "<u>" + bare_plural + "</u>");
	$(".case").html(contexthtml + " " + usentence); // Replace .Sentence with the name of your sentence column
	this.question;
	var radio_button_text_1;
	var radio_button_text_2;
	if (focus_flag == 0) {
	    this.question = "In the underlined statement, what question was the speaker addressing?";
	    if (ordering_flag == 0) {
		$('input[value="radio1"][name="binarychoice"]').val("NP");
		$('input[value="radio2"][name="binarychoice"]').val("VP");
		radio_button_text_1 = 'What qualities or actions are characteristic of <strong>[plural noun]</strong>?';
		radio_button_text_2 = 'What entities or things <strong>[verb phrase]</strong>?';
	    } else {
		$('input[value="radio1"][name="binarychoice"]').val("VP");
                $('input[value="radio2"][name="binarychoice"]').val("NP");
		radio_button_text_1 = 'What entities or things <strong>[verb phrase]</strong>?';
		radio_button_text_2 = 'What qualities or actions are characteristic of <strong>[plural noun]</strong>?';
	    }
	} else {
	    this.question = "In the underlined statement, what do you think the speaker meant?";
	    if (ordering_flag == 0) {
		$('input[value="radio1"][name="binarychoice"]').val("NP");
                $('input[value="radio2"][name="binarychoice"]').val("VP");
		radio_button_text_1 = "that <strong>[plural noun]</strong> (as opposed to other entities or things) [verb phrase]";
		radio_button_text_2 = "that [plural noun] <strong>[verb phrase]</strong> (as opposed to having other qualities or performing other actions)?";
	    } else {
		$('input[value="radio1"][name="binarychoice"]').val("VP");
                $('input[value="radio2"][name="binarychoice"]').val("NP");
		radio_button_text_1 = "that [plural noun] <strong>[verb phrase]</strong> (as opposed to having other qualities or performing other actions)?";
		radio_button_text_2 = "that <strong>[plural noun]</strong> (as opposed to other entities or things) [verb phrase]";
	    }
	}
	radio_button_text_1 = radio_button_text_1.replace("[plural noun]", generic.NP);
	radio_button_text_2 = radio_button_text_2.replace("[plural noun]", generic.NP);
	radio_button_text_1 = radio_button_text_1.replace("[verb phrase]", generic.VP);
	radio_button_text_2 = radio_button_text_2.replace("[verb phrase]", generic.VP);
	$('label[for=input1]').html(radio_button_text_1);
	$('label[for=input2]').html(radio_button_text_2);
	$(".question").html(this.question);
	$("#binary").show();
	$('input[name="binarychoice"]').prop('checked', false);
        $("input:radio[name=binarychoice]").click(function() {
	    exp.responseValue = $(this).val();
	    exp.responseLabel = $(this).next('label:first').text()
	});
	exp.responseValue = null;
    },

    button : function() {
	if (exp.responseValue  == null) {
            $(".err").show();
	} else {
            this.log_responses();
        /* use _stream.apply(this); if and only if there is
        "present" data. (and only *after* responses are logged) */
            _stream.apply(this);
	}
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

    log_responses : function() {
      exp.data_trials.push({
        "trial_type" : "single_generic_trial",
        "response" : exp.responseLabel,
	"question" : this.question,
	"focus" : exp.responseValue,
	"tgrep id" : this.generic.Item_ID,
	"noun phrase" : this.generic.NP,
	"verb phrase" : this.generic.VP,
	"verb" : this.generic.Verb,
	"entire sentence" : this.generic.Sentence
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
      var ut_id = "corpgen-focus-030617";
      if (UTWorkerLimitReached(ut_id)) {
        $('.slide').empty();
        repeatWorker = true;
        alert("You have already completed the maximum number of HITs allowed by this requester. Please click 'Return HIT' to avoid any impact on your approval rating.");
      }
  })();

  generics = generate_stim(number_of_generic_trials, false);
  ordering_flag = Math.floor(Math.random() * 2);
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
  exp.structure=["i0", "instructions", "focus_practice_trial", "generic_trial_series", 'subj_info', 'thanks'];

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
