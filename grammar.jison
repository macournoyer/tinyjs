// # The Parser's Grammar
//
// This grammar will be used to generate the parser (parser.js). It will turn the stream of
// tokens (defined in tokens.jisonlex) into a tree of nodes (defined in nodes.js).
//
// Note that our parser will be a lot more loose than real JavaScript. Being more strict,
// to catch errors at parse time, requires more rules and a more complex grammar.

%{
  var nodes = require('./nodes');
%}

// ## The operator precedence table.
// We only define a few operators. But normally, this is where you'd defined all the
// operators in the language.
%left ","
%right "="
%nonassoc "(" ")"
%left "."

// ## Defining the rules
// This is where we define all the parsing rules.
// The format is as follow: `ruleName: TOKEN orOtherRule | OTHER_TOKEN | ... ;`
// What we put in the `{ }` is what needs to be executed when the rule matches.
// We must assign to `$$` the node created by the rule.
// You can reference matched tokens using `$1` .. `$x`.

%start program  // Tell which rule to start with.

%%

// A JavaScript program is composed of statements.
program:
  statements EOF              { return $1; }
;

// A series of statements can be multiple things:
// - One single statements,
// - several ones, seperated by a `;`.
//
// We also need to handle edge cases, like trailing `;` and empty list of statements.
statements:
  statement                        { $$ = new nodes.BlockNode([ $1 ]); }
| statements terminator statement  { $1.push($3); $$ = $1; }
| statements terminator            { $$ = $1; }
|                                  { $$ = new nodes.BlockNode([]); }
;

terminator:
  ";"
| NEWLINE
;

statement:
  expression
| variableDeclaration 
;

// Expressions, as opposed to statements, return a value and can be nested inside
// other expressions or statements.
expression:
  literal
| variable
| property
| call
| function
;

// Literals are the hard-coded values in our program.
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

// And on and on we define the rest of our language ...
// Keep in mind this grammar only handles a subset of the JavaScript language and is
// intended to be as simple as possible and easy to understand.

variableDeclaration:
  VAR IDENTIFIER "=" expression { $$ = new nodes.DeclareVariableNode($2, $4); }
| VAR IDENTIFIER                { $$ = new nodes.DeclareVariableNode($2); }
;

variable:
  IDENTIFIER                    { $$ = new nodes.GetVariableNode($1); }
| IDENTIFIER "=" expression     { $$ = new nodes.SetVariableNode($1, $3); }
;

property:
  expression "." IDENTIFIER     { $$ = new nodes.GetPropertyNode($1, $3); }
| expression "." IDENTIFIER
    "=" expression              { $$ = new nodes.SetPropertyNode($1, $3, $5); }
;

call:
  IDENTIFIER "(" arguments ")"                { $$ = new nodes.CallNode(null, $1, $3); }
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
