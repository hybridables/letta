'use strict'

var test = require('mukla')
var co = require('../../index')
var readFile = require('mz/fs').readFile

test('co(* -> yield {}): should aggregate several promises', function () {
  return co(function * () {
    var a = readFile('index.js', 'utf8')
    var b = readFile('LICENSE', 'utf8')
    var c = readFile('package.json', 'utf8')

    var res = yield {
      a: a,
      b: b,
      c: c
    }

    test.strictEqual(3, Object.keys(res).length)
    test.strictEqual(res.a.indexOf('exports') !== -1, true)
    test.strictEqual(res.b.indexOf('MIT') !== -1, true)
    test.strictEqual(res.c.indexOf('devDependencies') !== -1, true)
  })
})

test('co(* -> yield {}): should noop with no args', function () {
  return co(function * () {
    var res = yield {}
    test.strictEqual(0, Object.keys(res).length)
  })
})

test('co(* -> yield {}): should ignore non-thunkable properties', function () {
  return co(function * () {
    var foo = {
      name: { first: 'tobi' },
      age: 2,
      address: readFile('index.js', 'utf8'),
      tobi: new Pet('tobi'),
      now: new Date(),
      falsey: false,
      nully: null,
      undefiney: undefined
    }

    var res = yield foo

    test.strictEqual('tobi', res.name.first)
    test.strictEqual(2, res.age)
    test.strictEqual('tobi', res.tobi.name)
    test.strictEqual(foo.now, res.now)
    test.strictEqual(false, foo.falsey)
    test.strictEqual(null, foo.nully)
    test.strictEqual(undefined, foo.undefiney)
    test.strictEqual(res.address.indexOf('exports') !== -1, true)
  })
})

test('co(* -> yield {}): should preserve key order', function () {
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
    test.strictEqual(orderBefore, orderAfter)
  })
})

function Pet (name) {
  this.name = name
  this.something = function () {}
}
