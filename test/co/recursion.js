'use strict'

var test = require('mukla')
var co = require('../../index')
var readFile = require('mz/fs').readFile

test('co() recursion: should aggregate arrays within arrays', function () {
  return co(function * () {
    var a = readFile('index.js', 'utf8')
    var b = readFile('LICENSE', 'utf8')
    var c = readFile('package.json', 'utf8')

    var res = yield [a, [b, c]]
    test.strictEqual(res.length, 2)
    test.strictEqual(res[0].indexOf('exports') !== -1, true)
    test.strictEqual(res[1].length, 2)
    test.strictEqual(res[1][0].indexOf('MIT') !== -1, true)
    test.strictEqual(res[1][1].indexOf('devDependencies') !== -1, true)
  })
})

test('co() recursion: should aggregate objects within objects', function () {
  return co(function * () {
    var a = readFile('index.js', 'utf8')
    var b = readFile('LICENSE', 'utf8')
    var c = readFile('package.json', 'utf8')

    var res = yield {
      0: a,
      1: {
        0: b,
        1: c
      }
    }

    test.strictEqual(res[0].indexOf('exports') !== -1, true)
    test.strictEqual(res[1][0].indexOf('MIT') !== -1, true)
    test.strictEqual(res[1][1].indexOf('devDependencies') !== -1, true)
  })
})
