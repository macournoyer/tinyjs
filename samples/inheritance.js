var Parent = function() {}
var Child = function() {}

Child.prototype.__tinyProto__ = Parent.prototype;

Parent.prototype.parentProperty = "in parent";
Child.prototype.childProperty = "in child";

var child = new Child();

console.log(child.childProperty);
console.log(child.parentProperty);
