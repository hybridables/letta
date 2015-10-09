'use strict'
var test = require('assertit')
var assert = require('assert')
var co = require('../../index')
var describe = test.describe
var it = test.it

var read = require('mz/fs').readFile

describe('co() recursion', function () {
  it('should aggregate arrays within arrays', function () {
    return co(function * () {
      var a = read('index.js', 'utf8')
      var b = read('LICENSE', 'utf8')
      var c = read('package.json', 'utf8')

      var res = yield [a, [b, c]]
      assert.strictEqual(res.length, 2)
      assert.strictEqual(res[0].indexOf('exports') !== -1, true)
      assert.strictEqual(res[1].length, 2)
      assert.strictEqual(res[1][0].indexOf('MIT') !== -1, true)
      assert.strictEqual(res[1][1].indexOf('devDependencies') !== -1, true)
    })
  })

  it('should aggregate objects within objects', function () {
    return co(function * () {
      var a = read('index.js', 'utf8')
      var b = read('LICENSE', 'utf8')
      var c = read('package.json', 'utf8')

      var res = yield {
        0: a,
        1: {
          0: b,
          1: c
        }
      }

      assert.strictEqual(res[0].indexOf('exports') !== -1, true)
      assert.strictEqual(res[1][0].indexOf('MIT') !== -1, true)
      assert.strictEqual(res[1][1].indexOf('devDependencies') !== -1, true)
    })
  })
})
