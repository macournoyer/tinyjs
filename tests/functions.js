// Create an object
a = {};
a.x = "object";
x = "global";

// Create a function referencing x property
f = function() { console.log(this.x) };
a.f = f;

a.f(); // => "object"
f(); // => "global"
