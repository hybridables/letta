'use strict'
var test = require('assertit')
var assert = require('assert')
var co = require('../../index')
var describe = test.describe
var it = test.it

function sleep (ms) {
  return function (done) {
    setTimeout(done, ms)
  }
}

function * work () {
  yield sleep(50)
  return 'yay'
}

describe('co(*)', function () {
  describe('with a generator function', function () {
    it('should wrap with co()', function () {
      return co(function * () {
        var a = yield work
        var b = yield work
        var c = yield work

        assert.strictEqual(a, 'yay')
        assert.strictEqual(b, 'yay')
        assert.strictEqual(c, 'yay')

        var res = yield [work, work, work]
        assert.deepEqual(res, ['yay', 'yay', 'yay'])
      })
    })

    it('should catch errors', function () {
      return co(function * () {
        yield function * () {
          throw new Error('boom')
        }
      }).then(function () {
        throw new Error('wtf')
      }, function (err) {
        assert.ifError(!err)
        assert.strictEqual(err.message, 'boom')
      })
    })
  })
})
