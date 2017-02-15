### Versions of Pattern

Current Pattern: 
- (NNS @>> (/^NP/ < /^PRP/ | < DT)) . (VP < VBP)
  - Around 800 cases.

Other Patterns to Note:
- /^NNS/ @, /^DT/ @, /^PRP/ . (/^VP/ < (/^VBP/ @< /^VP/))
  - Around 1000 cases.
  - Less restrictive with filtering out determiners.
- (NNS @>> (/^NP/ < /^PRP/ | < DT | << some | << most | << lot | << many | << /few/ | << several | << plenty)) . (VP < VBP)
  - Around 600 cases. 
  - Filters out quantifiers.
- (NNS @>> (/^NP/ < /^PRP/ | < DT | << some | << most | << lot | << many | << /few/ | << several | << plenty)) . (VP < VBP @<< (/are/ . /ing/))
  - Eliminates progressive tense (are traveling).
  - 522 cases
- (NNS @>> (/^NP/ < /^PRP/ | < DT | << some | << most | << lot | << many | << /few/ | << several | << plenty | << more)) . (VP < VBP) 
  - 579 cases
  - Filters out explicit comparision "more" by excluding the specific word.
- (NNS @>> (/^NP/ < /^PRP/ | < DT | << some | << most | << lot | << many | << /few/ | << several | << plenty)) . (VP < VBP @<< (/are/ . /er$/))
  - 591 cases
  - Eliminates comparison (i.e. are slower)
  - Does not account for sentences with words in between are and the comparison (i.e. are generally slower).
- (NNS @>> (/^NP/ < /^PRP/ | < DT | << some | << most | << lot | << many | << /few/ | << several | << plenty | << those | << these)) . (VP < VBP)
 - 587 cases
 - Filters out occurrences in relative clauses
- (NNS @>> (/^NP/ < /^PRP/ | < DT | << more | << some | << most | << lot | << many | << /few/ | << several | << plenty | << those | << these)) . (VP < VBP @<< (/are/ . /ing/) @<< (/are/ . /er$/))
  - Combines the four previous patterns.
  - 500 cases

Most Restrictive Patterns (around 200 cases for both):
- (NNS >>, /S*/ @> of) @>> VP . (VP < (VBP @< VP) @<< /PRP$/)
- NNS > (/^NP/ > /^S/) @$ /^DT/ @$ /^PRP/ . (/^V/ . /ADJP/ | . /^NP-PRD/ | @. *)