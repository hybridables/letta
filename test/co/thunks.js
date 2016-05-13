'use strict'

var test = require('mukla')
var co = require('../../index')

function get (val, err, error) {
  return function (done) {
    if (error) throw error
    setTimeout(function () {
      done(err, val)
    }, 10)
  }
}

test('co(* -> yield fn(done)): should work with no yields', function () {
  return co(function * () {})
})

test('co(* -> yield fn(done)): should work with one yield', function () {
  return co(function * () {
    var a = yield get(1)
    test.strictEqual(a, 1)
  })
})

test('co(* -> yield fn(done)): should work with several yields', function () {
  return co(function * () {
    var a = yield get(1)
    var b = yield get(2)
    var c = yield get(3)

    test.deepEqual([a, b, c], [1, 2, 3])
  })
})

test('co(* -> yield fn(done)): with many arguments should return an array', function () {
  function exec (cmd) {
    return function (done) {
      done(null, 'stdout', 'stderr')
    }
  }

  return co(function * () {
    var out = yield exec('something')
    test.deepEqual(out, ['stdout', 'stderr'])
  })
})

test('should be caught when the function throws', function () {
  return co(function * () {
    var a = 'default'
    try {
      a = yield get(1, null, new Error('boom'))
    } catch (err) {
      test.strictEqual(err.message, 'boom')
    }
    test.strictEqual(a, 'default')
  })
})

test('should only catch the first error only when an error is passed then thrown', function () {
  return co(function * () {
    yield function (done) {
      done(new Error('first'))
      throw new Error('second')
    }
  }).then(function () {
    throw new Error('wtf')
  }, function (err) {
    test.strictEqual(err.message, 'first')
  })
})

test('should throw and resume when an error is passed', function () {
  var error

  return co(function * () {
    try {
      yield get(1, new Error('boom'))
    } catch (err) {
      error = err
    }

    test.strictEqual(error.message, 'boom')
    var ret = yield get(1)
    test.strictEqual(ret, 1)
  })
})

test('should work with nested co()s', function () {
  var hit = []

  return co(function * () {
    var a = yield get(1)
    var b = yield get(2)
    var c = yield get(3)
    hit.push('one')

    test.deepEqual([a, b, c], [1, 2, 3])

    yield co(function * () {
      hit.push('two')
      var a = yield get(1)
      var b = yield get(2)
      var c = yield get(3)

      test.deepEqual([a, b, c], [1, 2, 3])

      yield co(function * () {
        hit.push('three')
        var a = yield get(1)
        var b = yield get(2)
        var c = yield get(3)

        test.deepEqual([a, b, c], [1, 2, 3])
      })
    })

    yield co(function * () {
      hit.push('four')
      var a = yield get(1)
      var b = yield get(2)
      var c = yield get(3)

      test.deepEqual([a, b, c], [1, 2, 3])
    })

    test.deepEqual(hit, ['one', 'two', 'three', 'four'])
  })
})

test('should be passed with a callback return values', function () {
  return co(function * () {
    return [
      yield get(1),
      yield get(2),
      yield get(3)
    ]
  }).then(function (res) {
    test.deepEqual(res, [1, 2, 3])
  })
})

test('should return the value when nested', function () {
  return co(function * () {
    var other = yield co(function * () {
      return [
        yield get(4),
        yield get(5),
        yield get(6)
      ]
    })

    return [
      yield get(1),
      yield get(2),
      yield get(3)
    ].concat(other)
  }).then(function (res) {
    test.deepEqual(res, [1, 2, 3, 4, 5, 6])
  })
})

test('should throw when yielding neither a function nor a promise', function () {
  var errors = []

  return co(function * () {
    var a = 'a'
    var b = 'b'

    try {
      a = yield 'something'
    } catch (err) {
      errors.push(err.message)
    }

    try {
      b = yield 'something'
    } catch (err) {
      errors.push(err.message)
    }

    test.strictEqual(errors.length, 2)
    var msg = 'yield a function, promise, generator, array, or object'
    test.strictEqual(errors[0].indexOf(msg) !== -1, true)
    test.strictEqual(errors[1].indexOf(msg) !== -1, true)
    test.strictEqual(a, 'a')
    test.strictEqual(b, 'b')
  })
})

test('should throw with errors', function () {
  var errors = []

  return co(function * () {
    var a = 'a'
    var b = 'b'

    try {
      a = yield get(1, new Error('foo'))
    } catch (err) {
      errors.push(err.message)
    }

    try {
      b = yield get(1, new Error('bar'))
    } catch (err) {
      errors.push(err.message)
    }

    test.deepEqual(errors, ['foo', 'bar'])
    test.strictEqual(a, 'a')
    test.strictEqual(b, 'b')
  })
})

test('should catch errors on .send()', function () {
  var errors = []

  return co(function * () {
    var a = 'a'
    var b = 'b'

    try {
      a = yield get(1, null, new Error('foo'))
    } catch (err) {
      errors.push(err.message)
    }

    try {
      b = yield get(1, null, new Error('bar'))
    } catch (err) {
      errors.push(err.message)
    }

    test.deepEqual(errors, ['foo', 'bar'])
    test.strictEqual(a, 'a')
    test.strictEqual(b, 'b')
  })
})

test('should pass future errors to the callback', function () {
  return co(function * () {
    yield get(1)
    yield get(2, null, new Error('fail'))
    test(false)
    yield get(3)
  }).catch(function (err) {
    test.strictEqual(err.message, 'fail')
  })
})

test('should pass immediate errors to the callback', function () {
  return co(function * () {
    yield get(1)
    yield get(2, new Error('fail'))
    test(false)
    yield get(3)
  }).catch(function (err) {
    test.strictEqual(err.message, 'fail')
  })
})

test('should catch errors on the first invocation', function () {
  return co(function * () {
    throw new Error('fail')
  }).catch(function (err) {
    test.strictEqual(err.message, 'fail')
  })
})
