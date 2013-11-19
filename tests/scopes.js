var top = "top";

f1 = function(x) {
  var f1Var = "f1Var";

  var f2 = function() {
    var y = "y";

    console.log(x);
    console.log(y);
    console.log(top);
    console.log(f1Var);

    top = "top overriden from function";
    console.log(top);
    global = "global defined from function";

    f1Var = "f1Var modified from f2";
  };

  f2();
  console.log(f1Var);
};

f1("x");
console.log(global);
console.log(root.f1Var);