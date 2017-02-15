### Versions of Pattern

Current Pattern: 
- (NNS @>> (/^NP/ << of | << /^PRP/ | << DT | << JJS)) . (VP < (VBP @< must @< should @< ought)) @>> (TOP << /UH/)
  - Filters out modifiers, quantifiers, and deontics.
    - In the case of "need" and "have", 6 out of 44 cases were "need to" or "have to":
        * "I think 0 that 's a lot of it too , is that people need *-1 to teach their kids , \[ what * not to , \+ what * to do *T*-2 \] and what * not to do *T*-3 . E_S"
       * "Because people have *-1 to vote in different areas E_S"
       * "the problem \[ \[ with , \+ with \] \+ \] right now is \[ w- , \+ \] that we 've got too many different health insurances that people have *-1 to go through *T*-2 E_S"
       * "and I also feel that that 's where some of the bad images of nursing homes come from *T*-1 . Is when people have *-2 to put people in a nursing homes *T*-3 E_S"
       * "\[ \[ I , \+ I \] just think 0 employers have *-1 to have , \+ * especially given today , the drug abuse that *T*-2 goes on , I just think 0 employers have *-3 to have \] some kind of way 0 * to see that they 're not being put *-7 at risk *T*-6 . Because they 're the ones who *T*-4 are going *-5 to have the lawsuits , the insurance claims , et cetera , E_S"
        * "Corporations have *-1 to *?* , E_S"
  - Also excludes sentences containing disfluencies.
  - 430 cases.

Previous Pattern:
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

