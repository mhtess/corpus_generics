var focus_flag = 1; 
/** Set flag to either 0 or 1 to indicate which experiment you want to run.
 * Flag 0: Will run the experiment asking the participant about what question the speaker was addressing.
 * Flag 1: Will run the experiment asking the participant about what they think the speaker meant.
 */

var questions = [    
    {question: "In the underlined statement, what question was the speaker addressing?", dependent_measure: "binary"},
    {question: "In the underlined statement, what do you think the speaker meant?", dependent_measure: "binary"},
]

var random_questions = [];
function  generate_random_questions(n) {
    var i = 0;
    while (i < n) {
	random_questions.push(questions[focus_flag]);
	i++
    }
}

