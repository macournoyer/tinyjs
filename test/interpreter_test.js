var assert = require("assert");
var runtime = require('../runtime');
var parser = require('../parser').parser;
require('../eval');

describe('Interpreter', function() {
  it('returns', function() {
    var nodes = parser.parse('return true; undefined')

    assert.equal(runtime.true, nodes.eval(runtime.root))
  })
  
  it('hoist variable declaration', function() {
    var nodes = parser.parse('return a; var a = 1')

    assert.equal(runtime.undefined, nodes.eval(runtime.root))
  })
  
  it('set properties', function() {
    var nodes = parser.parse('potato.x = true; return potato.x')

    assert.equal(runtime.true, nodes.eval(runtime.root))
  })
  
  it('define function', function() {
    var nodes = parser.parse('potato.f = function() { return true }; return potato.f()')

    assert.equal(runtime.true, nodes.eval(runtime.root))
  })
  
  it('call object method', function() {
    parser.parse('potato.x = true; potato.f = function() { return this.x }').eval(runtime.root)

    var nodes = parser.parse('return potato.f()')

    assert.equal(runtime.true, nodes.eval(runtime.root))
  })

  it('call function', function() {
    parser.parse('var x = true; var f = function() { return this.x }').eval(runtime.root)

    var nodes = parser.parse('return f()')

    assert.equal(runtime.true, nodes.eval(runtime.root))
  })

  it('create instances on new', function() {
    parser.parse('var F = function(x) { this.x = x }').eval(runtime.root)
    parser.parse('F.prototype.y = true').eval(runtime.root)

    var nodes = parser.parse('return new F(true)')
    var object = nodes.eval(runtime.root)

    assert.equal(runtime.true, object.get('x'))
    assert.equal(runtime.true, object.get('y'))
  })
})