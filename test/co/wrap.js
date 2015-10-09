'use strict'
var test = require('assertit')
var assert = require('assert')
var co = require('../../index')
var describe = test.describe
var it = test.it

describe('co.wrap(fn*)', function () {
  it('should pass context', function () {
    var ctx = {
      some: 'thing'
    }

    return co.wrap(function * () {
      assert.deepEqual(ctx, this)
    }).call(ctx)
  })

  it('should pass arguments', function () {
    return co.wrap(function * (a, b, c) {
      assert.deepEqual([a, b, c], [1, 2, 3])
    })(1, 2, 3)
  })

  it('should expose the underlying generator function', function () {
    var wrapped = co.wrap(function * (a, b, c) {})
    var source = Object.toString.call(wrapped.__generatorFunction__)
    assert.strictEqual(source.indexOf('function*'), 0)
  })
})
