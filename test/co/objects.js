'use strict'
var test = require('assertit')
var assert = require('assert')
var co = require('../../index')
var describe = test.describe
var it = test.it

var read = require('mz/fs').readFile

describe('co(* -> yield {})', function () {
  // @notice
  it('should aggregate several promises', function () {
    return co(function * () {
      var a = read('index.js', 'utf8')
      var b = read('LICENSE', 'utf8')
      var c = read('package.json', 'utf8')

      var res = yield {
        a: a,
        b: b,
        c: c
      }

      assert.strictEqual(3, Object.keys(res).length)
      assert.strictEqual(res.a.indexOf('exports') !== -1, true)
      assert.strictEqual(res.b.indexOf('MIT') !== -1, true)
      assert.strictEqual(res.c.indexOf('devDependencies') !== -1, true)
    })
  })

  it('should noop with no args', function () {
    return co(function * () {
      var res = yield {}
      assert.strictEqual(0, Object.keys(res).length)
    })
  })

  it('should ignore non-thunkable properties', function () {
    return co(function * () {
      var foo = {
        name: { first: 'tobi' },
        age: 2,
        address: read('index.js', 'utf8'),
        tobi: new Pet('tobi'),
        now: new Date(),
        falsey: false,
        nully: null,
        undefiney: undefined
      }

      var res = yield foo

      assert.strictEqual('tobi', res.name.first)
      assert.strictEqual(2, res.age)
      assert.strictEqual('tobi', res.tobi.name)
      assert.strictEqual(foo.now, res.now)
      assert.strictEqual(false, foo.falsey)
      assert.strictEqual(null, foo.nully)
      assert.strictEqual(undefined, foo.undefiney)
      assert.strictEqual(res.address.indexOf('exports') !== -1, true)
    })
  })

  it('should preserve key order', function () {
    function timedThunk (time) {
      return function (cb) {
        setTimeout(cb, time)
      }
    }

    return co(function * () {
      var before = {
        sun: timedThunk(30),
        rain: timedThunk(20),
        moon: timedThunk(10)
      }

      var after = yield before

      var orderBefore = Object.keys(before).join(',')
      var orderAfter = Object.keys(after).join(',')
      assert.strictEqual(orderBefore, orderAfter)
    })
  })
})

function Pet (name) {
  this.name = name
  this.something = function () {}
}
