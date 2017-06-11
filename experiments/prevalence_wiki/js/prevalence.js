var number_of_generic_trials = 25;

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
     //$(".n_entities").html(exp.n_entities);
     //$(".n_items").html(exp.n_trials);
   },
    button : function() {
      exp.go(); //use exp.go() if and only if there is no "present" data.
    }
  });


  slides.generateEntities = slide({
    name: "generateEntities",
    present: exp.stimuli,

    present_handle : function(stim) {
      this.counter = 1;
	 
      var generic = stim;
      this.generic = generic;
    
      // Workaround an issue with reading in header names. The context must be the last row in the data.
      var lastkey;
      for (key in generic) {
        lastkey = key;
      }
      this.Context = generic[lastkey];
	  var contexthtml = this.format_context(this.Context);
	  usentence = generic.Sentence.replace(generic.Sentence, "<u>" + generic.Sentence + "</u>");
      $(".case").html(contexthtml + " " + usentence); // Replace .Sentence with the name of your sentence column
      $(".NP").html(generic.NP);
      $(".VP").html(generic.VP);
      $(".err").hide();


      this.counter++;
      

      $("#tableGenerator").html('<table id="tableGenerator"> </table>');

      // create response table
      for(i=0; i<exp.n_entities; i++){


        var dispRow = $(document.createElement('tr'))
             .attr("id", 'rowp' + i);
        var numRow = $(document.createElement('tr'))
             .attr("id", 'rown' + i);
        var newRow = $(document.createElement('tr'))
             .attr("id", 'row' + i);

        var freqBox = $(document.createElement('td'))
             .attr("id", 'freqbox' + i);
        //freqBox.attr("colspan", "3");

        dispRow.append('<td/>');
        dispRow.append('<td style="text-align:center"><strong>' + stim.NP + "</strong>" + " that " + stim.VP + "</td>");
        dispRow.append('<td/>');
        dispRow.appendTo("#tableGenerator");

        numRow.append('<td class="left">0%</td>');
        numRow.append('<td><p style="text-align:center" id="slider_number' + i + '">---</p></td>');
        numRow.append('<td class="right">100%</td>');
        numRow.appendTo("#tableGenerator");

        freqBox.after().html('<div id="freqbox_response' + i + '" class="slider"></div>');

        newRow.append('<td/>');
        newRow.append(freqBox);
        newRow.append('<td/>');

        newRow.appendTo("#tableGenerator");
      }
      $(".err").hide();
      this.init_numeric_sliders();
      exp.sliderPost = []; 


    },



    format_context : function(context) {
        contexthtml = context.replace(/###/g, " ");
        contexthtml = contexthtml.replace(/@/g, ".");
        return contexthtml;
    },

    init_numeric_sliders : function() {
        for (i=0; i<exp.n_entities; i++) {
            utils.make_slider("#freqbox_response" + i, this.make_slider_callback(i));
        }
    },

    make_slider_callback : function(i) {
      return function(event, ui) {
        exp.sliderPost[i] = ui.value;
        $("#slider_number" + i).html(Math.round(exp.sliderPost[i]*100) + "%");
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
      exp.data_trials.push({
        "trial_type" : "single_generic_trial",
	"tgrep id" : this.generic.Item_ID,
	"noun phrase" : this.generic.NP,
	"verb phrase" : this.generic.VP,
	"verb" : this.generic.Verb,
	"entire sentence" : this.generic.Sentence,
    "context" : this.generic.Context,
    "freq" : exp.sliderPost[0],
      });
    },

  });

  slides.priors = slide({
    name: "priors",

    present: exp.stimscopy,

    present_handle : function(stim) {
      this.startTime = Date.now()
      this.stim =  stim;
      this.trialNum = exp.stimcounter;
      this.examples = exp.all_names[this.trialNum];
      this.allZeros = 1;
      this.hypothetical = 0;
      this.askDirect = 0;

      $("#tableGenerator").html('<table id="tableGenerator"> </table>');

      $(".prompt").html(
        "For each of the following types of " + this.stim.CCNP + ", how many <strong>" + this.stim.VP + "</strong>?<br><br>"
      );




      // create response table
      for(i=0; i<exp.n_entities; i++){


        var dispRow = $(document.createElement('tr'))
             .attr("id", 'rowp' + i);
        var numRow = $(document.createElement('tr'))
             .attr("id", 'rown' + i);
        var newRow = $(document.createElement('tr'))
             .attr("id", 'row' + i);

        var freqBox = $(document.createElement('td'))
             .attr("id", 'freqbox' + i);

        dispRow.append('<td/>');
        dispRow.append('<td style="text-align:center"><strong>' + this.stim.VP + "</strong>" + " that " + this.stim.VP + "</td>");
        dispRow.append('<td/>');
        dispRow.appendTo("#tableGenerator");

        numRow.append('<td class="left">0%</td>');
        numRow.append('<td><p style="text-align:center" id="slider_number' + i + '">---</p></td>');
        numRow.append('<td class="right">100%</td>');
        numRow.appendTo("#tableGenerator");

        freqBox.after().html('<div id="freqbox_response' + i + '" class="slider"></div>');

        newRow.append('<td/>');
        newRow.append(freqBox);
        newRow.append('<td/>');

        newRow.appendTo("#tableGenerator");
      }
      $(".err").hide();
      this.init_numeric_sliders();
      exp.sliderPost = []; 
    },


    init_numeric_sliders : function() {
        for (i=0; i<exp.n_entities; i++) {
            utils.make_slider("#freqbox_response" + i, this.make_slider_callback(i));
        }
    },

    make_slider_callback : function(i) {
      return function(event, ui) {
        exp.sliderPost[i] = ui.value;
        $("#slider_number" + i).html(Math.round(exp.sliderPost[i]*100) + "%");
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
          "trialNum" : this.trialNum,
          "tgrep_id" : this.stim.Item_ID, 
          "NP" : this.stim.NP,
          "VP" : this.stim.VP,
          "rt" : rt,
          "freq" : exp.sliderPost[i],
        })
      }
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
        problems: $("#problems").val(),
        fairprice: $("#fairprice").val(),
        comments : $("#comments").val()
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
      var ut_id = "corpgen-preval-061117-2";
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
  var stimuli = generate_stim(number_of_generic_trials, true);
  console.log(stimuli.length);
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
    //"priors",
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
