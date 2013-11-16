var util = require("util");

function JsObject() {
  this.properties = {};
}

exports.JsObject = JsObject;


// String
function JsString(value) {
  JsObject.call(this);
  this.value = value;
}

util.inherits(JsString, JsObject);
exports.JsString = JsString;


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
  this._this = _this;
  this.parent = parent;
  this.locals = this.properties = {};
}

exports.JsScope = JsScope;

JsScope.prototype.get = function(name) {
  if (this.locals.hasOwnProperty(name)) return this.locals[name];
  if (this.parent) return this.parent.get(name);
}


// Bootstrap the root objects.
var root = exports.root = new JsScope();
root._this = root;

root.locals['root'] = root;
root.locals['Object'] = new JsObject();

root.locals['console'] = new JsObject();
root.locals['console'].properties['log'] = function(scope, args) {
  console.log(args[0].value);
}