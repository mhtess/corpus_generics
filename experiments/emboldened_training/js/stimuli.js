var generate_stim = function() {
    var make_obj = function(arr) {
        var s1 = arr[0];
        var s2 = arr[1];
        var s3 = arr[2];
        var s4 = arr[3];
        var s5 = arr[4];
        var s6 = arr[5];

        obj = {
            "Context" : s1,
            "Sentence" : s2,
            "NP" : s3,
            "VP" : s4,
            "Verb": s5,
            "Item_ID" : s6 
        }
        return obj;
    }
    
    examples = [
        ["<br><b>Speaker #1</b>: ... <br><b>Speaker #2</b>:",
        "This is a sentence.",
        "This",
        "is a sentence.",
        "is",
        "1"
        ],

        ["<br><b>Speaker #1</b>: ... <br><b>Speaker #2</b>:",
        "This is a sentence.",
        "This",
        "is a sentence.",
        "is",
        "2"
        ],
              
        ["<br><b>Speaker #1</b>: ... <br><b>Speaker #2</b>:",
        "This is a sentence.",
        "This",
        "is a sentence.",
        "is",
        "3"
        ],
        
        ["<br><b>Speaker #1</b>: ... <br><b>Speaker #2</b>:",
        "This is a sentence.",
        "This",
        "is a sentence.",
        "is",
        "4"
        ],       
        
        ["<br><b>Speaker #1</b>: ... <br><b>Speaker #2</b>:",
        "This is a sentence.",
        "This",
        "is a sentence.",
        "is",
        "5"
        ],       
        
        ["<br><b>Speaker #1</b>: ... <br><b>Speaker #2</b>:",
        "This is a sentence.",
        "This",
        "is a sentence.",
        "is",
        "6"
        ],       
        
        ["<br><b>Speaker #1</b>: ... <br><b>Speaker #2</b>:",
        "This is a sentence.",
        "This",
        "is a sentence.",
        "is",
        "7"
        ],       
        
        ["<br><b>Speaker #1</b>: ... <br><b>Speaker #2</b>:",
        "This is a sentence.",
        "This",
        "is a sentence.",
        "is",
        "8"
        ],       
        
        ["<br><b>Speaker #1</b>: ... <br><b>Speaker #2</b>:",
        "This is a sentence.",
        "This",
        "is a sentence.",
        "is",
        "9"
        ],
        
        ["<br><b>Speaker #1</b>: ... <br><b>Speaker #2</b>:",
        "This is a sentence.",
        "This",
        "is a sentence.",
        "is",
        "10"
        ]
    ]

    data = [];
    for (var i=0; i < 10; i++) {
        data.push(make_obj(examples[i]));
    }
    return data;
}
