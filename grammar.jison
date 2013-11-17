%start program  /* optional */

%{
  var nodes = require('./nodes');
%}

%left ","
%right "="
%nonassoc "(" ")"
%left "."

%%

program:
  statements EOF              { return $1; }
;

statements:
  statement                   { $$ = new nodes.BlockNode([ $1 ]); }
| statements ";" statement    { $1.push($3); $$ = $1; }
| statements ";"              { $$ = $1; }
|                             { $$ = new nodes.BlockNode([]); }
;

statement:
  expression
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
  NUMBER                       { $$ = new nodes.NumberNode(parseInt($1)); }
| STRING                       { $$ = new nodes.StringNode($1.substring(1, $1.length-1)); }
| THIS                         { $$ = new nodes.ThisNode(); }
| TRUE                         { $$ = new nodes.TrueNode(); }
| FALSE                        { $$ = new nodes.FalseNode(); }
| NULL                         { $$ = new nodes.NullNode(); }
| UNDEFINED                    { $$ = new nodes.UndefinedNode(); }
| "{" "}"                      { $$ = new nodes.ObjectNode(); }
;

variable:
  IDENTIFIER                    { $$ = new nodes.GetVariableNode($1); }
| IDENTIFIER "=" expression     { $$ = new nodes.SetVariableNode($1, $3); }
| VAR IDENTIFIER "=" expression { $$ = new nodes.DeclareVariableNode($2, $4); }
| VAR IDENTIFIER                { $$ = new nodes.DeclareVariableNode($2); }
;

property:
  expression "." IDENTIFIER    { $$ = new nodes.GetPropertyNode($1, $3); }
| expression "." IDENTIFIER
    "=" expression             { $$ = new nodes.SetPropertyNode($1, $3, $5); }
;

call:
  IDENTIFIER "(" arguments ")" { $$ = new nodes.CallNode(null, $1, $3); }
| expression "." IDENTIFIER "(" arguments ")" { $$ = new nodes.CallNode($1, $3, $5); }
;

arguments:
  expression                   { $$ = [ $1 ]; }
| arguments "," expression     { $1.push($3); $$ = $1 }
|                              { $$ = []; }
;

function:
  FUNCTION "(" parameters ")" "{" statements "}"
                               { $$ = new nodes.FunctionNode($3, $6) }
;

parameters:
  IDENTIFIER                   { $$ = [ $1 ]; }
| parameters "," IDENTIFIER    { $1.push($3); $$ = $1 }
|                              { $$ = []; }
;
