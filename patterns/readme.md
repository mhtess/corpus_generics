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

Most Restrictive Patterns (around 200 cases for both):
- (NNS >>, /S*/ @> of) @>> VP . (VP < (VBP @< VP) @<< /PRP$/)
- NNS > (/^NP/ > /^S/) @$ /^DT/ @$ /^PRP/ . (/^V/ . /ADJP/ | . /^NP-PRD/ | @. *)