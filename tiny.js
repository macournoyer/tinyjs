var parser = require('./parser').parser;
var nodes = require('./nodes');
var eval = require('./eval');
var runtime = require('./runtime');

var code = process.argv.splice(2).join(' ');

parser.yy = nodes;

node = parser.parse(code);
// console.log(node);
node.eval(runtime.root);