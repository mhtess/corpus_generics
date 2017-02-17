var questions = [    
    {question: "In the underlined statement, is the speaker talking about [noun phrase] in general or some specific group/kind of [noun phrase]?", dependent_measure: "binary"}
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

