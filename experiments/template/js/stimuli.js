var path = '../../generics_project/results/';
var fname = 'swbd.tab';

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
		    for (var i = 1; i < n; i++) {
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
