var nodes = require('./nodes');
var runtime = require('./runtime');

nodes.BlockNode.prototype.eval = function(scope) {
  this.nodes.forEach(function(node) {
    node.eval(scope);
  });
}

// Literals

nodes.ThisNode.prototype.eval = function(scope) { return scope.this; }
nodes.TrueNode.prototype.eval = function(scope) { return runtime.true; }
nodes.FalseNode.prototype.eval = function(scope) { return runtime.false; }
nodes.NullNode.prototype.eval = function(scope) { return runtime.null; }
nodes.UndefinedNode.prototype.eval = function(scope) { return runtime.undefined; }

nodes.StringNode.prototype.eval = function(scope) {
  return new runtime.JsString(this.value);
}

nodes.NumberNode.prototype.eval = function(scope) {
  return new runtime.JsNumber(this.value);
}

nodes.ObjectNode.prototype.eval = function(scope) {
  return new runtime.JsObject();
}


// Variables

nodes.GetVariableNode.prototype.eval = function(scope) {
  var value = scope.get(this.name);
  if (typeof value === "undefined") throw this.name + " is not defined";
  return value;
}

nodes.SetVariableNode.prototype.eval = function(scope) {
  return scope.set(this.name, this.value.eval(scope));
}

nodes.DeclareVariableNode.prototype.eval = function(scope) {
  return scope.locals[this.name] = this.value ? this.value.eval(scope) : runtime.undefined;
}


// Properties

nodes.GetPropertyNode.prototype.eval = function(scope) {
  return this.object.eval(scope).get(this.name) || runtime.undefined;
}

nodes.SetPropertyNode.prototype.eval = function(scope) {
  return this.object.eval(scope).set(this.name, this.value.eval(scope));
}


// Functions

nodes.CallNode.prototype.eval = function(scope) {
  var receiver = this.object ? this.object.eval(scope) : scope;
  var evaledArguments = this.arguments.map(function(arg) { return arg.eval(scope) });
  var property = receiver.get(this.name);

  if (!property || !property.call) throw this.name + " is not a function";

  return property.call(receiver, scope, evaledArguments) || runtime.undefined;
}

nodes.FunctionNode.prototype.eval = function(scope) {
  return new runtime.JsFunction(this.body, this.parameters);
}
