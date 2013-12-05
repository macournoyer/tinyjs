// Expose TinyJs to be used in the browser.
// Bundle requires using: $ browserify browser.js -o bundle.js

var parser = require('./parser').parser;
var simpleParser = require('./demos/simple_parser').parser;
var lexer = require('./lexer');
var eval = require('./eval');
var nodes = require('./nodes');
var runtime = require('./runtime');

window.tinyjs = {
  nodes: nodes,
  runtime: runtime,
  
  parser: parser,
  simpleParser: simpleParser,

  lexer: lexer,

  eval: function(code) {
    node = parser.parse(code);
    return node.eval(runtime.root);
  }
}