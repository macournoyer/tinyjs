%start program  /* optional */

%left ","
%right "="
%nonassoc "(" ")"
%left "."

%%

program:
  statements EOF              { return $1; }
;

statements:
  statement                   { $$ = new yy.BlockNode([ $1 ]); }
| statements ";" statement    { $1.push($3); $$ = $1; }
| statements ";"              { $$ = $1; }
|                             { $$ = new yy.BlockNode([]); }
;

statement:
  expression
| return
;

// Expressions can return a value
expression:
  literal
| variable
| property
| call
| function
| "(" expression ")"           { $$ = $2; }
;

literal:
  NUMBER                       { $$ = new yy.NumberNode(parseInt($1)); }
| STRING                       { $$ = new yy.StringNode($1.substring(1, $1.length-1)); }
| THIS                         { $$ = new yy.ThisNode(); }
| TRUE                         { $$ = new yy.TrueNode(); }
| FALSE                        { $$ = new yy.FalseNode(); }
| NULL                         { $$ = new yy.NullNode(); }
| UNDEFINED                    { $$ = new yy.UndefinedNode(); }
| "{" "}"                      { $$ = new yy.ObjectNode(); }
;

variable:
  IDENTIFIER                   { $$ = new yy.GetVariableNode($1); }
| IDENTIFIER "=" expression    { $$ = new yy.SetVariableNode($1, $3); }
;

property:
  expression "." IDENTIFIER    { $$ = new yy.GetPropertyNode($1, $3); }
| expression "." IDENTIFIER
    "=" expression             { $$ = new yy.SetPropertyNode($1, $3, $5); }
;

call:
  IDENTIFIER "(" arguments ")" { $$ = new yy.CallNode(null, $1, $3); }
| expression "." IDENTIFIER "(" arguments ")" { $$ = new yy.CallNode($1, $3, $5); }
;

arguments:
  expression                   { $$ = [ $1 ]; }
| arguments "," expression     { $1.push($3); $$ = $1 }
|                              { $$ = []; }
;

function:
  FUNCTION "(" parameters ")" "{" statements "}"
                               { $$ = new yy.FunctionNode($3, $6) }
;

parameters:
  IDENTIFIER                   { $$ = [ $1 ]; }
| parameters "," IDENTIFIER    { $1.push($3); $$ = $1 }
|                              { $$ = []; }
;

return:
  RETURN                       { $$ = new yy.ReturnNode(); }
| RETURN expression            { $$ = new yy.ReturnNode($2); }
;
