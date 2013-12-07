// Create an object
a = {};
a.x = "object";
x = "global";

// Create a function referencing property `x`.
var f = function() {
  return this.x;
  console.log("unreachable");
}
a.f = f;

console.log(a.f()); // => "object"
console.log(f()); // => "global"
