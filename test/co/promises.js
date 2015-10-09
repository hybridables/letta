'use strict'
var test = require('assertit')
var assert = require('assert')
var co = require('../../index')
var describe = test.describe
var it = test.it

function getPromise (val, err) {
  return new Promise(function (resolve, reject) {
    if (err) reject(err)
    else resolve(val)
  })
}

describe('co(* -> yield <promise>', function () {
  describe('with one promise yield', function () {
    it('should work', function () {
      return co(function * () {
        var a = yield getPromise(1)
        assert.strictEqual(a, 1)
      })
    })
  })

  describe('with several promise yields', function () {
    it('should work', function () {
      return co(function * () {
        var a = yield getPromise(1)
        var b = yield getPromise(2)
        var c = yield getPromise(3)

        assert.deepEqual([a, b, c], [1, 2, 3])
      })
    })
  })

  describe('when a promise is rejected', function () {
    it('should throw and resume', function () {
      var error

      return co(function * () {
        try {
          yield getPromise(1, new Error('boom'))
        } catch (err) {
          error = err
        }

        assert.strictEqual(error.message, 'boom')
        var ret = yield getPromise(1)
        assert.strictEqual(ret, 1)
      })
    })
  })

  describe('when yielding a non-standard promise-like', function () {
    it('should return a real Promise', function () {
      var prom = co(function * () {
        yield { then: function () {} }
      })
      assert.strictEqual(prom instanceof Promise, true)
    })
  })
})

describe('co(function) -> promise', function () {
  it('return value', function (done) {
    co(function () {
      return 1
    }).then(function (data) {
      assert.strictEqual(data, 1)
      done()
    })
  })

  it('return resolve promise', function () {
    return co(function () {
      return Promise.resolve(1)
    }).then(function (data) {
      assert.strictEqual(data, 1)
    })
  })

  it('return reject promise', function () {
    return co(function () {
      return Promise.reject(1)
    }).catch(function (data) {
      assert.strictEqual(data, 1)
    })
  })

  it('should catch errors', function () {
    return co(function () {
      throw new Error('boom')
    }).then(function () {
      throw new Error('nope')
    }).catch(function (err) {
      assert.strictEqual(err.message, 'boom')
    })
  })
})
