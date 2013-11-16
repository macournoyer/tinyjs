var fs = require('fs');
var parser = require('./parser').parser;
var nodes = require('./nodes');
var eval = require('./eval');
var runtime = require('./runtime');

var file = process.argv[2];
var code = fs.readFileSync(file, "utf8");

parser.yy = nodes;

node = parser.parse(code);
node.eval(runtime.root);