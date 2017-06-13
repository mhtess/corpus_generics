var path = 'https://web.stanford.edu/~cfoster0/corpus_generics/generics_project/results/';
var fname = 'wiki_25.tab';

function get_data(fullpath) {
    var response = $.ajax({
        type: "GET",
        async: false,
        url: fullpath,
        dataType: "text",
    });
    return response.responseText;
}

function generate_stim(n, rand) {
	var contents = get_data(path + fname);
    var raw = contents;
        var rows = raw.split('\n');

	    var data = [];
	    headings = rows[0].split('\t');

	    if (rand == true) {
		    var total = rows.length - 2;
		    var rnums = [];
		    while (rnums.length < n) {
			    rnum = Math.floor((Math.random() * total) + 1);
			    if (rnums.indexOf(rnum) > -1) continue;
			    rnums.push(rnum);
		    }

		    for (num of rnums) {
			    data.push(rows[num].split('\t'));
		    }
	    } else {
		    for (var i = 1; i < n + 1; i++) {
			    data.push(rows[i].split('\t'));
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
        ["<br><b>Speaker #1</b>: Have you thought about biking to work instead?  <br><b>Speaker #2</b>:",
        "I would, but city drivers are senseless.",
        "city drivers",
        "are senseless.",
        "are",
        "1",
	    "N"
        ],  

	    ["<br><b>Speaker #1</b>: Does anything interesting happen around you on weekends? <br><b>Speaker #2</b>:",
        "Actually, yes. A few dozen folks meet at the shelter across the street and people spend time helping puppies.",
        "people",
        "spend time helping puppies.",
        "spend",
        "2",
        "P"
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
