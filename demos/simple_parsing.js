var parser = require('./simple_parser').parser;

console.log(parser.parse('1'))
console.log(parser.parse('2; "hi"'))