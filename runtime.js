var util = require("util");

// Primitives
exports.undefined = { value: undefined };
exports.null = { value: null };
exports.true = { value: true };
exports.false = { value: false };


// Object
function JsObject() {
  this.properties = {};
}

exports.JsObject = JsObject;

JsObject.prototype.get = function(name) { return this.properties[name]; }
JsObject.prototype.set = function(name, value) { return this.properties[name] = value; }


// String
function JsString(value) {
  JsObject.call(this);
  this.value = value;
}

util.inherits(JsString, JsObject);
exports.JsString = JsString;

// Number
function JsNumber(value) {
  this.value = value;
}

exports.JsNumber = JsNumber;


// Function
function JsFunction(body, parameters) {
  JsObject.call(this);
  this.body = body;
  this.parameters = parameters;
}

util.inherits(JsFunction, JsObject);
exports.JsFunction = JsFunction;

JsFunction.prototype.call = function(_this, scope, args) {
  var functionScope = new JsScope(_this, scope);

  for (var i = 0; i < this.parameters.length; i++) {
    functionScope.locals[this.parameters[i]] = args[i];
  }

  this.body.eval(functionScope);
}


//Scope
function JsScope(_this, parent) {
  this.this = _this;
  this.parent = parent;
  this.locals = {};
}

exports.JsScope = JsScope;

JsScope.prototype.hasLocal = function(name) {
  return this.locals.hasOwnProperty(name);
}

JsScope.prototype.get = function(name) {
  if (this.hasLocal(name)) return this.locals[name];
  if (this.parent) return this.parent.get(name);
}

JsScope.prototype.set = function(name, value) {
  if (!this.parent || this.hasLocal(name)) return this.locals[name] = value;
  return this.parent.set(name, value);
}


// Bootstrap the root objects.
var root = exports.root = new JsScope();
// Properties of the root/global scope are the local variables.
root.properties = root.locals;
root.this = root;

root.locals['root'] = root;

root.locals['console'] = new JsObject();
root.locals['console'].properties['log'] = function(scope, args) {
  console.log.apply(console, args.map(function(arg) { return arg.value }));
}