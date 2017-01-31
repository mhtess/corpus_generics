var path = '../../generics_project/results/';
var fname = 'swbd.tab';

function parse(n, rand) {
	var contents;
	... // Wherein we turn the file into a string contents

	$.get(path + fname, function(d) {
		contents = d;
	);

	var rows = contents.split('/n');

	var data = []
	headings = rows[0].split('/t');

	// FOR RETURNING THE ENTIRE DATASET
	for (var i = 1; i < rows.length; i++) {
		data.push(rows[i].split('/t'));
	}

	// FOR RANDOM SAMPLING FROM DATASET
	/*
	var total = rows.length;
	var rnums = [];
	while (rnums.length < n) {
		rnum = Math.floor((Math.random() * total) + 1);
		if (rnums.indexof(rnum) > -1) continue;
		rnums.push(rnum);
	}

	for (num in rnums) {
		data.push(rows[num].split('/t'));
	}
	*/


	var stim = data.map(function(row) {
		return row.reduce(function(result, field, index) {
			result[headings[index]] = field;
			return result;
		}, {});
	});

	return stim;
}
