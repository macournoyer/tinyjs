var assert = require("assert");
var parser = require('../parser').parser;
var nodes = require('../nodes');

describe('Parser', function() {
  it('parses numbers', function() {
    assert.deepEqual(
      new nodes.BlockNode([
        new nodes.NumberNode(1)
      ])
    , parser.parse("1"))
  })

  it('parses statements', function() {
    assert.deepEqual(
      new nodes.BlockNode([
        new nodes.NumberNode(1),
        new nodes.NumberNode(2),
      ])
    , parser.parse("1; 2"))
  })

  it('parses variable declaration', function() {
    assert.deepEqual(
      new nodes.BlockNode([
        new nodes.DeclareVariableNode("a")
      ])
    , parser.parse("var a"))
  })
  
  it('parses variable assignment', function() {
    assert.deepEqual(
      new nodes.BlockNode([
        new nodes.SetVariableNode("a", new nodes.NumberNode(1))
      ])
    , parser.parse("a = 1"))
  })
  
  it('parses property', function() {
    assert.deepEqual(
      new nodes.BlockNode([
        new nodes.SetPropertyNode(
          new nodes.ThisNode(),
          "a",
          new nodes.GetPropertyNode(
            new nodes.GetPropertyNode(
              new nodes.GetVariableNode("b"),
              "x"
            ),
            "y"
          )
        )
      ])
    , parser.parse("this.a = b.x.y"))
  })

  it('parses call', function() {
    assert.deepEqual(
      new nodes.BlockNode([
        new nodes.CallNode(new nodes.ThisNode, "a", [new nodes.NumberNode(1), new nodes.NumberNode(2)])
      ])
    , parser.parse("this.a(1, 2)"))
  })

  it('parses operators respecting precedence', function() {
    assert.deepEqual(
      new nodes.BlockNode([
        new nodes.AddNode(new nodes.NumberNode(1),
                          new nodes.MultiplyNode(new nodes.NumberNode(2), new nodes.NumberNode(3))
                         )
      ])
    , parser.parse("1 + 2 * 3"))
  })

  it('parses function', function() {
    assert.deepEqual(
      new nodes.BlockNode([
        new nodes.FunctionNode(["a", "b"], new nodes.BlockNode([ new nodes.ReturnNode ]))
      ])
    , parser.parse("function(a, b) { return }"))
  })

  // Exercise: make this pass
  it('parses new', function() {
    assert.deepEqual(
      new nodes.BlockNode([
        new nodes.NewNode("A", [new nodes.NumberNode(1), new nodes.NumberNode(2)])
      ])
    , parser.parse("new A(1, 2)"))
  })

})