var assert = require("assert");
var runtime = require('../runtime');
var parser = require('../parser').parser;
require('../eval');

describe('Runtime', function() {
  it('get property', function() {
    var object = new runtime.JsObject()
    object.set('x', runtime.true)

    assert.equal(runtime.true, object.get('x'))
  })
  
  it('get property from prototype', function() {
    var object = new runtime.JsObject()
    var proto = new runtime.JsObject()
    object.set('__tinyProto__', proto)
    proto.set('x', runtime.true)

    assert.equal(runtime.true, object.get('x'))
  })

  it('creates global when setting undeclared local', function() {
    var global = new runtime.JsScope()
    var scope = new runtime.JsScope(runtime.root, global)
    scope.set('x', runtime.true)

    assert.equal(runtime.true, global.get('x'))
  })

  it('call functions', function() {
    var func = new runtime.JsFunction(['a'], parser.parse('return a'))

    assert.equal(runtime.true, func.call(null, runtime.root, [runtime.true]))
  })

  describe('new Function', function() {

    it('passes arguments', function() {
      var constructor = new runtime.JsFunction(['a'], parser.parse('this.a = a'))    
      var object = constructor.new(runtime.root, [runtime.true]);

      assert.equal(runtime.true, object.get('a'))
    })

    it('assigns prototype', function() {
      var constructor = new runtime.JsFunction([], parser.parse(''))
      constructor.get('prototype').set('x', runtime.true)
      var object = constructor.new(runtime.root, []);

      assert.equal(runtime.true, object.get('x'))
    })

  })

})