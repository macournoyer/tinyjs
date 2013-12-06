var Parent = function() {}
var Child = function() {}

// Inherit from Parent
Child.prototype = new Parent();

Parent.prototype.parentProperty = "in parent";
Child.prototype.childProperty = "in child";

var child = new Child();

console.log(child.childProperty);
console.log(child.parentProperty);
