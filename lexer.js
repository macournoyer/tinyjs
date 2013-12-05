// THIS IS NOT THE LEXER. The lexer's code is in parser.js.
// This file only contains functions to help test the lexer.

var parser = require('./parser').parser;

exports.lex = function(code) {
  var lexer = parser.lexer;
  var terminals = parser.terminals_;
  var token, tokens = [];

  lexer.setInput(code);

  while ((token = lexer.lex()) !== 1) {
    tokens.push([terminals[token] || token, lexer.yytext]);
  }

  return tokens;
}
