exports.JsObject = function JsObject() {
  this.properties = {};
}

exports.JsString = function JsString(value) {
  this.value = value;
}

exports.JsFunction = function JsFunction(body) {
  exports.JsObject.call(this);
  this.body = body;
}

exports.JsFunction.prototype = Object.create(exports.JsObject.prototype);
exports.JsFunction.prototype.constructor = exports.JsFunction;

exports.JsFunction.prototype.call = function(_this, scope, args) {
  this.body.eval(scope);
}

exports.JsScope = function JsScope(_this, parent) {
  this._this = _this;
  this.parent = parent;
  this.locals = this.properties = {};
}

exports.JsScope.prototype.get = function(name) {
  if (this.locals.hasOwnProperty(name)) return this.locals[name];
  if (this.parent) return this.parent.get(name);
}


// Bootstrap the root objects.
var root = exports.root = new exports.JsScope();
root._this = root;

root.locals['root'] = root;
root.locals['Object'] = new exports.JsObject();

root.locals['console'] = new exports.JsObject();
root.locals['console'].properties['log'] = function(scope, args) {
  console.log(args[0].value);
}