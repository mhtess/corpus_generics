var number_of_generic_trials = 28;
var trialcounter = 0;

function make_slides(f) {
  var slides = {};
  var generics = generate_stim(number_of_generic_trials, true);

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

  slides.dr_practice_trial = slide({
    name: "dr_practice_trial",
    start: function() {
      $(".err").hide();
      //$("#correction1").hide();
      $("#specify_box_trial1").hide();
      //$("#correction2").hide();
      $("#specify_box_trial2").hide();

      $("input:radio[name=exchange1]").click(function() {
            $(".err").hide();
            exp.responseValue1 = $(this).val();
            /*if (exp.responseValue1 == "Human beings") {
                $("#correction1").hide();
            } else {
                $("#correction1").show();
            }*/
      });
      $("input:radio[name=exchange2]").click(function() {
            $(".err").hide();
            exp.responseValue2 = $(this).val();
            /*if (exp.responseValue2 == "People who") {
                $("#correction2").hide();
            } else {
                $("#correction2").show();
            }*/
      });
      exp.specifyValue1 = null;
      exp.specifyValue2 = null;

    },
    button : function() {
      exp.specifyValue1 = $("#text_response_trial1").val();
      exp.specifyValue2 = $("#text_response_trial2").val();
      if (exp.responseValue1  == null || exp.responseValue2 == null) {
            $(".err").show();
      /*} else if (exp.responseValue1 != "Humans in general") {
            $("#correction1").show();
      } else if (exp.responseValue2 != "People who") {
            $("#correction2").show();
      */
      } else if (exp.specifyValue1 == "" && exp.responseValue1 == "People who") {
            $("#reprompt_trial1").show();
      } else if (exp.specifyValue2 == "" && exp.responseValue2 == "People who") {
            $("#reprompt_trial2").show();
      } else {
        exp.catch_trials.push({
          "trial_type" : "dr_np_practice_trial",
          "response" : exp.responseValue1,
          "specific" : exp.specifyValue1,
        });
        exp.catch_trials.push({
          "trial_type" : "dr_np_practice_trial",
          "response" : exp.responseValue2,
          "specific" : exp.specifyValue2
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
    $("#multi_order").hide();
    $("#textbox").hide();
    $("#rate").hide();
    $('input[name="text_response"]').val('');
    this.stim = stim;
    generic = stim;
    this.generic = generic;
    var contexthtml = this.format_context(generic.Context);
    bare_plural = generic.NP + " " + generic.VP;
    usentence = generic.Sentence.replace(bare_plural, "<u>" + bare_plural + "</u>");
    $(".case").html(contexthtml + " " + usentence); // Replace .Sentence with the name of your sentence column
    this.question = random_questions[trialcounter];
    var question = this.question.question.replace(/\[noun phrase\]/g, generic.NP);
    question = question.replace("[verb phrase]", generic.VP); // Replace .VP with the name of your verb column
    $(".question").html(question);  
    switch(this.question.dependent_measure) {
    case "textbox":
        $("#textbox_response").val("");
        $("#textbox").show();
        $("#textbox_response").on('input', function() {
            exp.responseValue = $(this).val();
        });
        break;
    case "multi":
        $('input[name="multichoice"]').prop('checked', false);
        $("#multi_order").show();
        $("input:radio[name=multichoice]").click(function() {
            exp.responseValue = $(this).val();
        });
        break;
    default:
        $("#rate").show();
        this.init_numeric_sliders();
        $(".slider_number").html("--");
        exp.sliderPost = null;
        break;
    }
    exp.responseValue = null;
    exp.specifyValue = null;
    trialcounter++;
    },

    button : function() {
    exp.specifyValue = $('input[name="text_response"]').val();
    if (exp.responseValue  == null) {
            $(".err").show();
    } else if (exp.specifyValue == "" && exp.responseValue == "People who") {
            $("#reprompt").show();
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
        "response" : exp.responseValue,
        "specific" : exp.specifyValue,
    "question" : this.question.question,
    "tgrep id" : this.generic.Item_ID,
    "noun phrase" : this.generic.NP, // Same instructions as above
    "verb phrase" : this.generic.VP, // ""
    "entire sentence" : this.generic.Sentence // ""
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
  generics = generate_stim(number_of_generic_trials, true);
  generate_random_questions(number_of_generic_trials);
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
  exp.structure=["i0", "instructions", "dr_practice_trial", "generic_trial_series", 'subj_info', 'thanks'];
  
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
