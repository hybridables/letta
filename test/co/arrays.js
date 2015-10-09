'use strict'
var test = require('assertit')
var assert = require('assert')
var co = require('../../index')
var describe = test.describe
var it = test.it

var read = require('mz/fs').readFile

describe('co(* -> yield [])', function () {
  it('should aggregate several promises', function () {
    return co(function * () {
      var a = read('index.js', 'utf8')
      var b = read('LICENSE', 'utf8')
      var c = read('package.json', 'utf8')

      var res = yield [a, b, c]
      assert.strictEqual(3, res.length)
      assert.strictEqual(res[0].indexOf('exports') !== -1, true)
      assert.strictEqual(res[1].indexOf('MIT') !== -1, true)
      assert.strictEqual(res[2].indexOf('devDependencies') !== -1, true)
    })
  })

  it('should noop with no args', function () {
    return co(function * () {
      var res = yield []
      assert.strictEqual(0, res.length)
    })
  })

  it('should support an array of generators', function () {
    return co(function * () {
      var val = yield [(function * () { return 1 })()]
      assert.deepEqual(val, [1])
    })
  })
})
