// # The Tokens
// The tokens are the atomic units of our programs. We tag each one with a type.
// This stream of tokens will then be fed to the parser.
//
// Note that the rules are applied from top to bottom, first one to match.

%%

"//".*                // ignore comment

\n+                   return 'NEWLINE';
\s+                   // skip other whitespace

// Literals: the hardcoded values in your programs.
[0-9]+\b              return 'NUMBER';
\"[^"]*\"             return 'STRING';
\'[^']*\'             return 'STRING';

// Keywords
"function"            return 'FUNCTION';
"var"                 return 'VAR'
"this"                return 'THIS';
"true"                return 'TRUE';
"false"               return 'FALSE';
"null"                return 'NULL';
"undefined"           return 'UNDEFINED';

// Identifiers are names: variable and function names.
[a-zA-Z_]\w*          return 'IDENTIFIER';

// We end with a catch all rule. Any one single character that has not been matched
// will be handled here. A few examples: `.`, `+`, `(` and `)`.
.                     return yytext;

<<EOF>>               return 'EOF';
