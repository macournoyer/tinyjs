// # The Tokens
// The tokens are the atomic units of our programs. We tag each one with a type.
// This stream of tokens will then be fed to the parser.

%%

\s+                   /* skip whitespace */
"//".*                /* ignore comment */

// Literals
[0-9]+\b              return 'NUMBER';
\"[^"]*\"             return 'STRING';

// Keywords
"function"            return 'FUNCTION';
"var"                 return 'VAR'
"this"                return 'THIS';
"true"                return 'TRUE';
"false"               return 'FALSE';
"null"                return 'NULL';
"undefined"           return 'UNDEFINED';

[a-zA-Z_]\w*          return 'IDENTIFIER';

<<EOF>>               return 'EOF';

// We end with a catch all rule. Any one single character that has not been matched
// will be handled here. A few examples: `.`, `+`, `(` and `)`.
.                     return yytext;
