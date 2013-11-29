var A = function() {
  this.x = 'x';
}

A.prototype.y = 'y';

var a = new A();

console.log(a.x);
console.log(a.y);