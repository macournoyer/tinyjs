// Create an object
a = {};
a.x = "object";
x = "global";

// Create a function referencing property `x`.
f = function() { console.log(this.x) }
a.f = f;

a.f(); // => "object"
f(); // => "global"
