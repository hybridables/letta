'use strict'

var test = require('mukla')
var co = require('../../index')
var readFile = require('mz/fs').readFile

test('co(* -> yield []): should aggregate several promises', function () {
  return co(function * () {
    var a = readFile('index.js', 'utf8')
    var b = readFile('LICENSE', 'utf8')
    var c = readFile('package.json', 'utf8')

    var res = yield [a, b, c]
    test.strictEqual(3, res.length)
    test.strictEqual(res[0].indexOf('exports') !== -1, true)
    test.strictEqual(res[1].indexOf('MIT') !== -1, true)
    test.strictEqual(res[2].indexOf('devDependencies') !== -1, true)
  })
})

test('co(* -> yield []): should noop with no args', function () {
  return co(function * () {
    var res = yield []
    test.strictEqual(0, res.length)
  })
})

test('co(* -> yield []): should support an array of generators', function () {
  return co(function * () {
    var val = yield [(function * () { return 1 })()]
    test.deepEqual(val, [1])
  })
})
