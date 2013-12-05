var nodes = require('../nodes'),
    runtime = require('../runtime'),
    eval = require('../eval');

// The following is the three of nodes for `var s = "hi!"; console.log(s);`.
// This is what the parser does, it reads your program and spits out a tree of nodes.
treeOfNodes = new nodes.BlockNode([
  // `var s = "hi";`
  new nodes.DeclareVariableNode(
    "s", // variable name
    new nodes.StringNode("hi!") // value
  ),
  // `console.log(s);`
  new nodes.CallNode(
    new nodes.GetVariableNode("console"), // receiving object of function call
    "log", // function name
    [ // arguments
      new nodes.GetVariableNode("s")
    ]
  )
]);

// This tree of node is the internal representation of our program.
// To execute it, we must evaluate it. That's the job of the interpreter.

var scope = runtime.root;
treeOfNodes.eval(scope);
