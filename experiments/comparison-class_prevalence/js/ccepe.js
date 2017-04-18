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
     $(".n_entities").html(exp.n_entities);
     $(".n_items").html(exp.n_trials);
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
	  var contexthtml = this.format_context(generic.Context);
	  bare_plural = generic.NP + " " + generic.VP;
	  usentence = generic.Sentence.replace(bare_plural, "<u>" + bare_plural + "</u>");
	  $(".case").html(contexthtml + " " + usentence); // Replace .Sentence with the name of your sentence column
      $(".comparison_class").html(generic.CCN);

      $(".n_entities").html(exp.n_entities);

      $(".err").hide();

      $("#entityTable").empty();
      var newTextBoxDiv = $(document.createElement('div'))
           .attr("id", 'TextBoxDiv' + this.counter);
      newTextBoxDiv.after().html('<label>Example #'+ this.counter + ' : </label>' +
            '<input type="text" name="textbox' + this.counter +
            '" id="textbox' + this.counter + '" value="" >');

      newTextBoxDiv.appendTo("#entityTable");
      $("#textbox"+ this.counter).focus()

      this.counter++;
      $(document).one("keydown", _s.keyPressHandler);

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
	"tgrep id" : this.generic.Item_ID,
	"noun phrase" : this.generic.NP,
	"verb phrase" : this.generic.VP,
	"verb" : this.generic.Verb,
	"entire sentence" : this.generic.Sentence,
    "context" : this.generic.Context,
  "e1" : exp.names[0],
  "e2" : exp.names[1],
  "e3" : exp.names[2],
  "e4" : exp.names[3],
      });
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
            if (_s.counter > exp.n_entities) {
              for(i=1; i<(_s.counter); i++){
                exp.names.push(
                  $('#textbox' + i).val()
                )
              }
              setTimeout(function(){
                _s.log_responses();
                exp.all_names.push(exp.names.slice());
                exp.names.length = 0;
                _stream.apply(_s);
              }, 250);

              //exp.go(); //make sure this is at the *end*, after you log your data
            } else {
              var newTextBoxDiv = $(document.createElement('div'))
                   .attr("id", 'TextBoxDiv' + _s.counter);

              newTextBoxDiv.after().html('<label>Example #'+ _s.counter + ' : </label>' +
                    '<input type="text" name="textbox' + _s.counter +
                    '" id="textbox' + _s.counter + '" value="" >');
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
        "For each of the following things, how many <strong>" + this.stim.VP + "</strong>?<br><br>"
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
        dispRow.append('<td style="text-align:center"><strong>' + this.examples[i] + "</strong>" + " that " + this.stim.VP + "</td>");
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
          "NP" : this.examples[i],
          "VP" : this.stim.VP,
          "rt" : rt,
          //trialNum: trialNum,
          //n_times: parseInt($("#freqbox_response" + i).val()),
          //interval: $("#interval" + i).val()
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

  /*repeatWorker = false;
  (function(){
      var ut_id = "mht-hab-priors-20170405";
      if (UTWorkerLimitReached(ut_id)) {
        $('.slide').empty();
        repeatWorker = true;
        alert("You have already completed the maximum number of HITs allowed by this requester. Please click 'Return HIT' to avoid any impact on your approval rating.");
      }
  })();*/

  exp.n_entities = 4;
  exp.names = [];
  exp.all_names = []; 
  exp.trials = [];
  exp.catch_trials = [];
  var stimuli = generate_stim(10, true);
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
    "generateEntities",
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
