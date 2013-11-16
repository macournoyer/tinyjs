%%

\s+                   /* skip whitespace */
"//".*                /* ignore comment */

// Literals
[0-9]+\b              return 'NUMBER';
\"[^"]*\"             return 'STRING';

// Keywords
"function"            return 'FUNCTION';
"return"              return 'RETURN';
"this"                return 'THIS';
"true"                return 'TRUE';
"false"               return 'FALSE';
"null"                return 'NULL';
"undefined"           return 'UNDEFINED';

[a-zA-Z_]\w*          return 'IDENTIFIER';

// Catch all
.                     return yytext;

<<EOF>>               return 'EOF';
