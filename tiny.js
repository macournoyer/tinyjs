// # Putting it all together
//
// All the pieces of our language are put together here.
//
// usage: node tiny.js samples/functions.js

var parser = require('./parser').parser;
var eval = require('./eval');
var runtime = require('./runtime');
var fs = require('fs');

// We first read the file passed as an argument to the process.
var file = process.argv[2];
var code = fs.readFileSync(file, "utf8");

// We then feed the code to the parser. Which will turn our code into
// a tree of nodes.
var node = parser.parse(code);

// Finally, start the evaluation of our program on the top of the tree,
// passing the root (global) object as the scope in which to start its execution.
node.eval(runtime.root);