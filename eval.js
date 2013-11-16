var nodes = require('./nodes');
var runtime = require('./runtime');

nodes.BlockNode.prototype.eval = function(scope) {
  this.nodes.forEach(function(node) {
    node.eval(scope);
  });
}

nodes.StringNode.prototype.eval = function(scope) {
  return new runtime.JsString(this.value);
}

nodes.ThisNode.prototype.eval = function(scope) {
  return scope._this;
}

nodes.ObjectNode.prototype.eval = function(scope) {
  return new runtime.JsObject();
}

nodes.GetVariableNode.prototype.eval = function(scope) {
  var value = scope.get(this.name);
  if (typeof value === "undefined") throw this.name + " is not defined";
  return value;
}

nodes.SetVariableNode.prototype.eval = function(scope) {
  return scope.locals[this.name] = this.value.eval(scope);
}

nodes.GetPropertyNode.prototype.eval = function(scope) {
  return this.object.eval(scope).properties[this.name];
}

nodes.SetPropertyNode.prototype.eval = function(scope) {
  return this.object.eval(scope).properties[this.name] = this.value.eval(scope);
}

nodes.CallNode.prototype.eval = function(scope) {
  var evaledObject = this.object ? this.object.eval(scope) : runtime.root;
  var evaledArguments = this.arguments.map(function(arg) { return arg.eval(scope) });
  var property = evaledObject.properties[this.name];

  return property.call(evaledObject, scope, evaledArguments);
}

nodes.FunctionNode.prototype.eval = function(scope) {
  return new runtime.JsFunction(this.body, this.parameters);
}
