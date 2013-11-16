var nodes = require('./nodes');
var runtime = require('./runtime');

nodes.BlockNode.prototype.eval = function(scope) {
  try {
    this.nodes.forEach(function(node) {
      node.eval(scope);
    });
  } catch (e) {
    if (e instanceof Return) return e.value;
    throw e;
  }
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
  var functionScope = new runtime.JsScope(evaledObject, scope);
  var property = evaledObject.properties[this.name];

  return property.call(evaledObject, functionScope, evaledArguments);
}

nodes.FunctionNode.prototype.eval = function(scope) {
  return new runtime.JsFunction(this.body);
}


function Return(value) {
  this.value = value;
}

nodes.ReturnNode.prototype.eval = function(scope) {
  var value = this.value;

  if (value)
    throw new Return(value.eval(scope));
  else
    throw new Return();
}