%start program  // Tell which rule to start with.

%%

program:
  statements EOF             { return $1; }
;

statements:
  statement                  { $$ = [ $1 ] }
| statements ';' statement   { $1.push($3); // $1 (statements) is the array created on previous line
                               $$ = $1 }
;

statement:
  NUMBER                     { $$ = $1 }
| STRING                     { $$ = $1 }
;