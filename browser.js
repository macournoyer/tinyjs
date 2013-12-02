// Enable to used in the browser.
// Compile requires using: $ browserify browser.js -o bundle.js

var parser = require('./parser').parser;
var eval = require('./eval');
var runtime = require('./runtime');

window.tinyjs = {
  lex: function(code) {
    var lexer = parser.lexer;
    var terminals = parser.terminals_;
    var token, tokens = [];

    lexer.setInput(code);

    while ((token = lexer.lex()) !== 1) {
      tokens.push([terminals[token] || token, lexer.yytext]);
    }

    return tokens;
  },

  parse: function(code) {
    return parser.parse(code);
  },

  eval: function(code) {
    node = parser.parse(code);
    return node.eval(runtime.root);
  }
}