// Define all the node constructors we'll be using.

exports.BlockNode = function BlockNode(nodes) {
  this.nodes = nodes;
}

exports.BlockNode.prototype.push = function(node) {
  this.nodes.push(node);
}

exports.NumberNode = function NumberNode(value) { this.value = value; }
exports.StringNode = function StringNode(value) { this.value = value; }

exports.ThisNode = function ThisNode() {}
exports.TrueNode = function TrueNode() {}
exports.FalseNode = function FalseNode() {}
exports.NullNode = function NullNode() {}
exports.UndefinedNode = function UndefinedNode() {}
exports.ObjectNode = function ObjectNode() {}

exports.GetVariableNode = function GetVariableNode(name) { this.name = name; }
exports.SetVariableNode = function SetVariableNode(name, value) {
  this.name = name;
  this.value = value;
}
exports.DeclareVariableNode = function SetVariableNode(name, value) {
  this.name = name;
  this.value = value;
}

exports.GetPropertyNode = function GetPropertyNode(object, name) {
  this.object = object;
  this.name = name;
}
exports.SetPropertyNode = function SetPropertyNode(object, name, value) {
  this.object = object;
  this.name = name;
  this.value = value;
}

exports.CallNode = function CallNode(object, name, arguments) {
  this.object = object;
  this.name = name;
  this.arguments = arguments;
}

exports.FunctionNode = function FunctionNode(parameters, body) {
  this.parameters = parameters;
  this.body = body;
}

exports.ReturnNode = function ReturnNode(value) { this.value = value; }
