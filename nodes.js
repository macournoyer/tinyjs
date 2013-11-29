// Define all the nodes produced by the parser.

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
exports.SetVariableNode = function SetVariableNode(name, valueNode) {
  this.name = name;
  this.valueNode = valueNode;
}
exports.DeclareVariableNode = function DeclareVariableNode(name, valueNode) {
  this.name = name;
  this.valueNode = valueNode;
}

exports.GetPropertyNode = function GetPropertyNode(objectNode, name) {
  this.objectNode = objectNode;
  this.name = name;
}
exports.SetPropertyNode = function SetPropertyNode(objectNode, name, valueNode) {
  this.objectNode = objectNode;
  this.name = name;
  this.valueNode = valueNode;
}

exports.CallNode = function CallNode(objectNode, name, argumentNodes) {
  this.objectNode = objectNode;
  this.name = name;
  this.argumentNodes = argumentNodes;
}

exports.FunctionNode = function FunctionNode(parameters, bodyNode) {
  this.parameters = parameters;
  this.bodyNode = bodyNode;
}

exports.ReturnNode = function ReturnNode(valueNode) {
  this.valueNode = valueNode;
}

exports.NewNode = function NewNode(name, argumentNodes) {
  this.name = name;
  this.argumentNodes = argumentNodes;
}
