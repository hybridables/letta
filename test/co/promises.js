'use strict'

var test = require('mukla')
var co = require('../../index')

function getPromise (val, err) {
  return new Promise(function (resolve, reject) {
    if (err) reject(err)
    else resolve(val)
  })
}

test('co(* -> yield <promise>: should work with one promise yield', function () {
  return co(function * () {
    var a = yield getPromise(1)
    test.strictEqual(a, 1)
  })
})

test('co(* -> yield <promise>: should work with several promise yields', function () {
  return co(function * () {
    var a = yield getPromise(1)
    var b = yield getPromise(2)
    var c = yield getPromise(3)

    test.deepEqual([a, b, c], [1, 2, 3])
  })
})

test('co(* -> yield <promise>: should throw and resume when a promise is rejected', function () {
  var error

  return co(function * () {
    try {
      yield getPromise(1, new Error('boom'))
    } catch (err) {
      error = err
    }

    test.strictEqual(error.message, 'boom')
    var ret = yield getPromise(1)
    test.strictEqual(ret, 1)
  })
})

test('co(* -> yield <promise>: should return a real Promise when yielding a non-standard promise-like', function () {
  var prom = co(function * () {
    yield { then: function () {} }
  })
  test.strictEqual(prom instanceof Promise, true)
})

test('co(function) -> promise: return value', function (done) {
  co(function () {
    return 1
  }).then(function (data) {
    test.strictEqual(data, 1)
    done()
  })
})

test('co(function) -> promise: return resolve promise', function () {
  return co(function () {
    return Promise.resolve(1)
  }).then(function (data) {
    test.strictEqual(data, 1)
  })
})

test('co(function) -> promise: return reject promise', function () {
  return co(function () {
    return Promise.reject(1)
  }).catch(function (data) {
    test.strictEqual(data, 1)
  })
})

test('co(function) -> promise: should catch errors', function () {
  return co(function () {
    throw new Error('boom')
  }).then(function () {
    throw new Error('nope')
  }).catch(function (err) {
    test.strictEqual(err.message, 'boom')
  })
})
