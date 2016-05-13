'use strict'

var test = require('mukla')
var co = require('../../index')

test('co.wrap(fn*): should pass context', function () {
  var ctx = {
    some: 'thing'
  }

  return co.wrap(function * () {
    test.deepEqual(ctx, this)
  }).call(ctx)
})

test('co.wrap(fn*): should pass arguments', function () {
  return co.wrap(function * (a, b, c) {
    test.deepEqual([a, b, c], [1, 2, 3])
  })(1, 2, 3)
})

test('co.wrap(fn*): should expose the underlying generator function', function () {
  var wrapped = co.wrap(function * (a, b, c) {})
  var source = Object.toString.call(wrapped.__generatorFunction__)
  test.strictEqual(source.indexOf('function*'), 0)
})
