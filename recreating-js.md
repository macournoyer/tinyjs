# Reimplementing JavaScript in less than 250 lines of code

Nobody trully understands how the world works. It is too complex. Instead, we build models, that we beleive are close to how the real thing works. We use those models to discover and understand how the world works.

Following the same line of reasoning, I want to show you a model of how JavaScript work inside. It will not be the real thing, because the real thing is too complexe to learn in a short article. But it will help you create a model in your mind of how it works. It will help you understand how objects, scopes and functions work. So that you no longer program by blindly applying rules, but by understanding how it works.

Every language is seperated into at least three parts. The parser, transforms your program into something the language can understand. The runtime, is the living world in which your program executes. Finally, the interpreter, puts the two togheter, modifying the runtime by interpreting the output of the parser.

A parser defines how the language looks (the syntax), the runtime defines how it behaves (how we will create object, for example). Since I want to help you create a mental model of how JavaScript behaves with scopes and such, I will be talking about the runtime. If you're interested in learning about the full picture of how a languages work, take a look at [my book](http://createyourproglang.com/) and my [online class](http://proglangmasterclass.com/). If you enjoy this article, I'm sure you'll enjoy them.

## The Runtime

<runtime.js>

## The Nodes

Before we put the runtime into actions, we must talk briefly about the internal representation of our programs. How our language understands the code that we feed it.

After beeing parsed, a program will be represented as a tree of nodes.

The following is the three of nodes for `var s = "hi!"; console.log(s);`.
This is what the parser does, it reads your program and spits out a tree of nodes.

    treeOfNodes = new nodes.BlockNode([
      // `var s = "hi";`
      new nodes.DeclareVariableNode(
        "s", // variable name
        new nodes.StringNode("hi!") // value
      ),
      // `console.log(s);`
      new nodes.CallNode(
        new nodes.GetVariableNode("console"), // receiving object of function call
        "log", // function name
        [ // arguments
          new nodes.GetVariableNode("s")
        ]
      )
    ]);

This tree of node is the internal representation of our program.
To execute it, we must evaluate it. That's the job of the interpreter.

## The Interpreter

<eval.js>

## It's Alive!

Our own little tiny implementation of JavaScript is now able to execute simple programs such as:

    // Create an object
    var a = {};
    a.x = "object";
    var x = "global";

    // Create a function referencing property `x`.
    var f = function() { console.log(this.x) }
    a.f = f;

    a.f(); // => "object"
    f(); // => "global"

And more complexe ones involving nested functions like this:

    var top = "top";

    var f1 = function() {
      var f1Var = "f1 var";
      var f2 = function() {
        top = "top overriden from nested function";
        global = "global defined from function";

        f1Var = "f1 var modified from f2";
      }
      f2();
    }

    f1();

How awesome is that?

## Thanks!

I hope you enjoyed this article. As I said in the intro, the goal of this is to help you create a model, in your head, of how the real JavaScript work. Once you do, you'll be able to do amazing things without relying on others giving you all the answers.

If you enjoyed this, please buy book [Create Your Own Programming Language](http://createyourproglang.com/) or join my class [The Programming Language Masterclass](http://proglangmasterclass.com/).

In the bonus video of the class (Live Plus pacakge), I'll show you how the parser is implemented and complete the runtime by implementing `return`, operators and variable declaration hoisting to name a few.

Thanks again for reading and happy coding!

_- [Marc](http://macournoyer.com/)_