// # The Runtime
// The runtime is the environment in which the language executes.
// We need to build representations for primitive and objects we'll have access to inside
// the language.
//
// Our runtime will be a simplified version of the real JavaScript runtime.

var util = require("util");


// ## Primitives
// Normally true and false are objects.
// We map the primitives to their JavaScript conteirpart (in their `value` attribute).
exports.true = { value: true };
exports.false = { value: false };
exports.null = { value: null };
exports.undefined = { value: undefined };


// ## Object
// Objects have properties. One missing piece here is the prototype. To keep things simple here,
// we will not have any form of inheritance.
function JsObject() {
  this.properties = {};
}
exports.JsObject = JsObject;

// The only thing we can do on objects, is get and set properties.
JsObject.prototype.get = function(name) {
  return this.properties[name];
}
JsObject.prototype.set = function(name, value) {
  return this.properties[name] = value;
}


// Strings are objects, but they wrap a real JavaScript string.
function JsString(value) {
  JsObject.call(this);
  this.value = value;
}
util.inherits(JsString, JsObject);
exports.JsString = JsString;

// Numbers are not objects.
function JsNumber(value) {
  this.value = value;
}
exports.JsNumber = JsNumber;

// ## Scopes
// The most controversial and confusing part of JavaScript is the way it handles scopes.
// But surprisingly, it can be implemented in a very simple and straightforward fashion.
//
// The scope encapsulates the context of execution: the local variables and the value of `this`.
// Scopes also have a parent scope. The chain of parents will go down to the root scope,
// where you define your global variables.
function JsScope(_this, parent) {
  this.this = _this;
  this.parent = parent;
  this.locals = {};
}
exports.JsScope = JsScope;

JsScope.prototype.hasLocal = function(name) {
  return this.locals.hasOwnProperty(name);
}

// Getting a variable is done by looking first in the current scope, then recurcively going
// in the parent until we reach the root scope.
// This is how we get access to variables defined in parent functions.
JsScope.prototype.get = function(name) {
  if (this.hasLocal(name)) return this.locals[name];
  if (this.parent) return this.parent.get(name);
}

// Setting the value of a variables follows the same logic as when getting it's value.
// We search where the variable was defined and change it's value. If the variable
// was not defined in any parent scope, we'll end up in the root scope, which will have
// the effect as declaring it as a global variable.
//
// Because of this behaviour, `set` can't be used for declaring local variable, we'll
// use `setLocal` for that.
JsScope.prototype.set = function(name, value) {
  if (!this.parent || this.hasLocal(name)) return this.locals[name] = value;
  return this.parent.set(name, value);
}

JsScope.prototype.setLocal = function(name, value) {
  return this.locals[name] = value;
}


// Functions encapsulate a body that we can eval (execute) and parameters:
// `function (parameters) { body }`
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


// Bootstrap the root object.
var root = exports.root = new JsScope();
root.this = root;
// Properties of the root/global scope are the local variables.
root.properties = root.locals;

// Here we'd normaly define all the things you can access to inside the runtime.
// But we'll keep it simple and only define root and the console.log function.
root.locals['root'] = root;

root.locals['console'] = new JsObject();
root.locals['console'].properties['log'] = function(scope, args) {
  console.log.apply(console, args.map(function(arg) { return arg.value }));
}