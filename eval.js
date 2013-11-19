// # The Interpreter
// The interpreter part of our language is where we'll evaluate the nodes to execute the program.
// Thus the name `eval` for the function we'll be defining here.
//
// We'll add an `eval` function to each node produced by the parser. Each node will know how to
// evaluate itself. For example, a `StringNode` will know how to turn itself into a real string
// inside our program.
//
// One thing our interpreter does not support is variable declaration hoisting. In JavaScript,
// variable declarations are moved (hoisted) invisibly to the top of their scope. This would
// require two passes in the node tree by the interpreter, a first one for declaring and one
// for evaling.

var nodes = require('./nodes');
var runtime = require('./runtime');

// The top node of a tree of nodes will always be of type BlockNode. To spread the 

nodes.BlockNode.prototype.eval = function(scope) {
  this.nodes.forEach(function(node) {
    node.eval(scope);
  });
}

// Literals are pretty easy to eval. Simply return the runtime value.
nodes.ThisNode.prototype.eval      = function(scope) { return scope.this; }
nodes.TrueNode.prototype.eval      = function(scope) { return runtime.true; }
nodes.FalseNode.prototype.eval     = function(scope) { return runtime.false; }
nodes.NullNode.prototype.eval      = function(scope) { return runtime.null; }
nodes.UndefinedNode.prototype.eval = function(scope) { return runtime.undefined; }

nodes.StringNode.prototype.eval = function(scope) { return new runtime.JsString(this.value); }
nodes.NumberNode.prototype.eval = function(scope) { return new runtime.JsNumber(this.value); }
nodes.ObjectNode.prototype.eval = function(scope) { return new runtime.JsObject(); }


// Variables are stored in the scope. All we need to do to interpret the variable nodes is
// get and set values in the scope.

nodes.DeclareVariableNode.prototype.eval = function(scope) {
  return scope.locals[this.name] = this.valueNode ? this.valueNode.eval(scope) : runtime.undefined;
}

nodes.GetVariableNode.prototype.eval = function(scope) {
  var value = scope.get(this.name);
  if (typeof value === "undefined") throw this.name + " is not defined";
  return value;
}

nodes.SetVariableNode.prototype.eval = function(scope) {
  return scope.set(this.name, this.valueNode.eval(scope));
}


// Getting and setting properties is handled by the two following nodes.

nodes.GetPropertyNode.prototype.eval = function(scope) {
  return this.objectNode.eval(scope).get(this.name) || runtime.undefined;
}

nodes.SetPropertyNode.prototype.eval = function(scope) {
  return this.objectNode.eval(scope).set(this.name, this.valueNode.eval(scope));
}


// Finally, creating and calling functions.

nodes.FunctionNode.prototype.eval = function(scope) {
  return new runtime.JsFunction(this.bodyNode, this.parameters);
}

nodes.CallNode.prototype.eval = function(scope) {
  if (this.objectNode) { // object.name(...)
    var object = this.objectNode.eval(scope);
    var property = object.get(this.name);
  } else { // name()
    var object = runtime.root;
    var property = scope.get(this.name);
  }
  var args = this.argumentNodes.map(function(arg) { return arg.eval(scope) });

  if (!property || !property.call) throw this.name + " is not a function";

  return property.call(object, scope, args) || runtime.undefined;
}
