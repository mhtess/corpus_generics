var questions = [    
    {question: "In the underlined statement, what group of people is the speaker talking about?", dependent_measure: "multi"}
]

var random_questions = [];
function  generate_random_questions(n) {
    var i = 0;
    while (i < n) {
	var rand = questions[Math.floor(Math.random() * questions.length)];
	random_questions.push(rand);
	i++
    }
}

