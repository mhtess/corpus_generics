var generate_stim = function() {
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
        ["<br><b>Speaker #1</b>: What carries Lyme disease? <br><b>Speaker #2</b>:",
        "Ticks carry Lyme disease.",
        "Ticks",
        "carry Lyme disease.",
        "carry",
        "1",
	"NP"
        ],

        ["<br><b>Speaker #1</b>: What animal has a mane? <br><b>Speaker #2</b>:",
        "Lions have manes.",
        "Lions",
        "have manes.",
        "have",
        "2",
	"NP"
        ],
              
        ["<br><b>Speaker #1</b>: What animal has beautiful feathers? <br><b>Speaker #2</b>:",
        "Peacocks have beautiful feathers.",
        "Peacocks",
        "have beautiful feathers.",
        "have",
        "3",
	"NP"
        ],
        
        ["<br><b>Speaker #1</b>: What animal builds dams?  <br><b>Speaker #2</b>:",
        "Beavers build dams.",
        "Beavers",
        "build dams.",
        "build",
        "4",
	"NP"
        ],       
        
        ["<br><b>Speaker #1</b>: What animals are friendly? <br><b>Speaker #2</b>:",
        "Dogs are friendly.",
        "Dogs",
        "are friendly.",
        "are",
        "5",
	"NP"
        ],   
	
	["<br><b>Speaker #1</b>: What animal flies? <br><b>Speaker #2</b>:",
        "Ducks fly.",
        "Ducks",
        "fly.",
        "fly",
        "6",
	"NP"
        ],

	["<br><b>Speaker #1</b>: What animal lays eggs? <br><b>Speaker #2</b>:",
        "Birds lay eggs.",
        "Birds",
        "lay eggs.",
        "lay",
        "7",
	"NP"
        ],

        ["<br><b>Speaker #1</b>: What animal is white? <br><b>Speaker #2</b>:",
        "Swans are white.",
        "Swans",
        "are white.",
        "are",
	"8",
	"NP"
        ],

	["<br><b>Speaker #1</b>: What bites people? <br><b>Speaker #2</b>:",
        "Mosquitos bite people.",
        "Mosquitos",
        "bite people.",
        "bite",
        "9",
	"NP"
        ],

        ["<br><b>Speaker #1</b>: What gives birth to live young? <br><b>Speaker #2</b>:",
        "Whales give birth to live young.",
        "Whales",
        "give birth to live young.",
        "give",
        "10",
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

        ["<br><b>Speaker #1</b>: What is a distinctive feature of lions? <br><b>Speaker #2</b>:",
        "Lions have manes.",
        "Lions",
        "have manes.",
        "have",
        "12",
	"VP"
        ],

        ["<br><b>Speaker #1</b>: What do peacocks look like?  <br><b>Speaker #2</b>:",
        "Peacocks have beautiful feathers.",
        "Peacocks",
        "have beautiful feathers.",
        "have",
        "13",
	"VP"
        ],

	["<br><b>Speaker #1</b>: What do beavers do?  <br><b>Speaker #2</b>:",
        "Beavers build dams.",
        "Beavers",
        "build dams.",
        "build",
        "14",
	"VP"
        ],

        ["<br><b>Speaker #1</b>: What are dogs like? <br><b>Speaker #2</b>:",
        "Dogs are friendly.",
        "Dogs",
        "are friendly.",
        "are",
        "15",
	"VP"
        ],
        
        ["<br><b>Speaker #1</b>: How do ducks move around? <br><b>Speaker #2</b>:",
        "Ducks fly.",
        "Ducks",
        "fly.",
        "fly",
        "16",
	"VP"
        ],       
        
        ["<br><b>Speaker #1</b>: How do birds reproduce? <br><b>Speaker #2</b>:",
        "Birds lay eggs.",
        "Birds",
        "lay eggs.",
        "lay",
        "17",
	"VP"
        ],       
        
        ["<br><b>Speaker #1</b>: What color are swans? <br><b>Speaker #2</b>:",
        "Swans are white.",
        "Swans",
        "are white.",
        "are",
        "18",
	"VP"
        ],       
        
        ["<br><b>Speaker #1</b>: What do mosquitos do? <br><b>Speaker #2</b>:",
        "Mosquitos bite people.",
        "Mosquitos",
        "bite people.",
        "bite",
        "19",
	"VP"
        ],
        
        ["<br><b>Speaker #1</b>: How do whales reproduce? <br><b>Speaker #2</b>:",
        "Whales give birth to live young.",
        "Whales",
        "give birth to live young.",
        "give",
        "20",
	"VP"
        ]
    ]

    data = [];
    for (var i=0; i < 20; i++) {
        data.push(make_obj(examples[i]));
    }
    return data;
}
