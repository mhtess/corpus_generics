//var path = 'https://web.stanford.edu/~chakia/CoCoLab/corpus_generics/generics_project/results/';

var rows = sample19_plus;

// function get_data(handleData) {
//   var path = 'https://web.stanford.edu/~mtessler/corpus_generics/experiments/db/';
//   var fname = 'sample19_plus.tab';
//
//     var response = $.ajax({
//         type: "GET",
//         async: true,
//         url: fullpath,
//         success:function(data) {
//           handleData(data);
//         }
//     });
// }

function generate_stim(n, rand) {

	    var data = [];
	    headings = _.keys(rows[0]);

	    if (rand == true) {
		    var total = rows.length;
		    var rnums = [];
		    while (rnums.length < n) {
			    rnum = Math.floor((Math.random() * total));
			    if (rnums.indexOf(rnum) > -1) continue;
			    rnums.push(rnum);
		    }
		    for (num of rnums) {
			    data.push(
            _.values(rows[num])
          );
		    }
	    } else {
		    for (var i = 0; i < n; i++) {
			    data.push(
            _.values(rows)
          );
		    }
	    }
	    var stim = data.map(function(row) {
		    return row.reduce(function(result, field, index) {
			    result[headings[index]] = field;
			    return result;
		    }, {});
	    });

	return stim;
}

function generate_training_stim(n) {
    var make_obj = function(arr) {
        var s1 = arr[0];
        var s2 = arr[1];
        var s3 = arr[2];
        var s4 = arr[3];
        var s5 = arr[4];
        var s6 = arr[5];
	    var s7 = arr[6];
        obj = {
            "Context" : s1,
            "Sentence" : s2,
            "NP" : s3,
            "VP" : s4,
            "Verb": s5,
            "Item_ID" : s6,
	    "Correct" : s7
        }
        return obj;
    }

    examples = [
        ["<br><b>Speaker #1</b>: What animal builds dams?  <br><b>Speaker #2</b>:",
        "Beavers build dams.",
        "Beavers",
        "build dams.",
        "build",
        "4",
	    "NP"
        ],

	    ["<br><b>Speaker #1</b>: What disease do ticks carry? <br><b>Speaker #2</b>:",
        "Ticks carry Lyme disease.",
        "Ticks",
        "carry Lyme disease.",
        "carry",
        "11",
        "VP"
        ],

        ["<br><b>Speaker #1</b>: What animal has beautiful feathers? <br><b>Speaker #2</b>:",
        "Peacocks have beautiful feathers.",
        "Peacocks",
        "have beautiful feathers.",
        "have",
        "3",
	    "NP"
        ],

        ["<br><b>Speaker #1</b>: What color are swans? <br><b>Speaker #2</b>:",
        "Swans are white.",
        "Swans",
        "are white.",
        "are",
        "18",
	    "VP"
        ],
    ]
    training_examples = [];
    var ntex = examples.length;
    var rnums = [];
    while (rnums.length < n) {
	    rnum = Math.floor((Math.random() * ntex));
	    if (rnums.indexOf(rnum) > -1) continue;
	    rnums.push(rnum);
    }
    for (num of rnums) {
	    training_examples.push(make_obj(examples[num]));
    }
    return training_examples;
}

 function format_context(context) {
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
}
