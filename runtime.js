// # The Runtime
// The runtime is the environment in which the language executes.
// We need to build representations for primitive and objects we'll have access to inside
// the language.
//
// Our runtime will be a simplified version of the real JavaScript runtime. But it will behave
// very close to the original, while being less than 70 lines of code.

var util = require("util");


// ## Primitives
// We map the primitives to their JavaScript conteirpart (in their `value` property).
// Note that, normally, true and false would be objects.
exports.true = { value: true };
exports.false = { value: false };
exports.null = { value: null };
exports.undefined = { value: undefined };


// ## Object
// Objects have properties. One missing piece here is the prototype. To keep things simple,
// we will not have any form of inheritance.
function JsObject() {
  this.properties = {};
}
exports.JsObject = JsObject;

// The only things we can do on objects, are get and set properties.
JsObject.prototype.get = function(name) {
  return this.properties[name];
}
JsObject.prototype.set = function(name, value) {
  return this.properties[name] = value;
}

// Strings are objects, and they wrap a real JavaScript string (in `value`).
function JsString(value) {
  JsObject.call(this);
  this.value = value;
}
util.inherits(JsString, JsObject);
exports.JsString = JsString;

// Numbers are not objects, they only wrap a JavaScript number value.
function JsNumber(value) {
  this.value = value;
}
exports.JsNumber = JsNumber;


// ## Scopes
// The most controversial and confusing part of JavaScript is the way it handles scopes.
// But surprisingly, it can be implemented in a very simple and straightforward fashion.
//
// A scope encapsulates the context of execution: the local variables and the value of `this`.
// Scopes also have a parent scope. The chain of parents will go down to the root scope,
// where you define your global variables.
function JsScope(_this, parent) {
  this.this = _this;
  this.parent = parent;
  this.root = !parent;
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
  if (this.hasLocal(name)) return this.locals[name]; // Look in current scope
  if (this.parent) return this.parent.get(name); // Look in parent scope
}

// Setting the value of a variables follows the same logic as when getting it's value.
// We search where the variable was defined and change it's value. If the variable
// was not defined in any parent scope, we'll end up in the root scope, which will have
// the effect as declaring it as a global variable.
//
// Because of this behaviour, `set` can't be used for declaring local variables, we'll
// use `scope.locals[name] = value` for that.
//
// This is why, in JavaScript, if you assign a value to a variable without declaring it
// (using `var`) first, it will search in parent scopes until it reaches the root scope and
// declare it there, thus declaring it as a global variable.
JsScope.prototype.set = function(name, value) {
  if (this.root || this.hasLocal(name)) return this.locals[name] = value;
  return this.parent.set(name, value);
}


// ## Function
// Functions encapsulate a body that we can execute (eval) and parameters:
// `function (parameters) { body }`.
function JsFunction(body, parameters) {
  JsObject.call(this);
  this.body = body;
  this.parameters = parameters;
}
util.inherits(JsFunction, JsObject);
exports.JsFunction = JsFunction;

// When the function is called, a new scope is created so that the function will have its
// own set of local variables and its own value for `this`.
//
// The function's body is a tree of nodes.
// - nodes.js defines those nodes.
// - eval.js defines how each node is evaluated.
//
// To evaluate (execute) a tree of node, we simply call the `eval` method on the top of the tree.
JsFunction.prototype.call = function(object, scope, args) {
  var functionScope = new JsScope(object, scope); // this = object, parent scope = scope

  // We assign passed arguments (args) to local variables.
  for (var i = 0; i < this.parameters.length; i++) {
    functionScope.locals[this.parameters[i]] = args[i];
  }

  this.body.eval(functionScope);
}


// ## The root object
// The only missing piece of the runtime at this point is the root (global) object.
// We create it as a scope that also acts as an object (has properties).
var root = exports.root = new JsScope();
root.this = root; // this == root when in root scope.

// Properties of the root/global scope are also the local variables. That's why when you
// use `var a = 1;` in the root scope, it will also assign the value to `root.a`.
root.properties = root.locals;

// Here we'd normaly define all the fancy things you can access to inside the runtime.
// But we'll keep it simple and only define `root` and the `console.log` function.
root.locals['root'] = root;

root.locals['console'] = new JsObject();
root.locals['console'].properties['log'] = function(scope, args) {
  console.log.apply(console, args.map(function(arg) { return arg.value }));
}