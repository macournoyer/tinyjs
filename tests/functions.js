// Create an object
a = {};
a.x = "ok";

// Create a function referencing x property
a.f = function() { console.log(this.x) };

a.f(); // => "ok"