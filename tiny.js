var fs = require('fs');
var parser = require('./parser').parser;
var eval = require('./eval');
var runtime = require('./runtime');

var file = process.argv[2];
var code = fs.readFileSync(file, "utf8");

node = parser.parse(code);
node.eval(runtime.root);