'use strict'

var test = require('mukla')
var co = require('../../index')

function sleep (ms) {
  return function (done) {
    setTimeout(done, ms)
  }
}

function * work () {
  yield sleep(50)
  return 'yay'
}

test('co(fn*) with a generator function: should wrap with co()', function () {
  return co(function * () {
    var a = yield work
    var b = yield work
    var c = yield work

    test.strictEqual(a, 'yay')
    test.strictEqual(b, 'yay')
    test.strictEqual(c, 'yay')

    var res = yield [work, work, work]
    test.deepEqual(res, ['yay', 'yay', 'yay'])
  })
})

test('co(fn*) with a generator function: should catch errors', function () {
  return co(function * () {
    yield function * () {
      throw new Error('boom')
    }
  }).then(function () {
    throw new Error('wtf')
  }, function (err) {
    test.ifError(!err)
    test.strictEqual(err.message, 'boom')
  })
})
