'use strict'
var test = require('assertit')
var assert = require('assert')
var co = require('../../index')
var describe = test.describe
var it = test.it

function get (val, err, error) {
  return function (done) {
    if (error) throw error
    setTimeout(function () {
      done(err, val)
    }, 10)
  }
}

describe('co(* -> yield fn(done))', function () {
  describe('with no yields', function () {
    it('should work', function () {
      return co(function * () {})
    })
  })

  describe('with one yield', function () {
    it('should work', function () {
      return co(function * () {
        var a = yield get(1)
        assert.strictEqual(a, 1)
      })
    })
  })

  describe('with several yields', function () {
    it('should work', function () {
      return co(function * () {
        var a = yield get(1)
        var b = yield get(2)
        var c = yield get(3)

        assert.deepEqual([a, b, c], [1, 2, 3])
      })
    })
  })

  describe('with many arguments', function () {
    it('should return an array', function () {
      function exec (cmd) {
        return function (done) {
          done(null, 'stdout', 'stderr')
        }
      }

      return co(function * () {
        var out = yield exec('something')
        assert.deepEqual(out, ['stdout', 'stderr'])
      })
    })
  })

  describe('when the function throws', function () {
    it('should be caught', function () {
      return co(function * () {
        var a = 'default'
        try {
          a = yield get(1, null, new Error('boom'))
        } catch (err) {
          assert.strictEqual(err.message, 'boom')
        }
        assert.strictEqual(a, 'default')
      })
    })
  })

  describe('when an error is passed then thrown', function () {
    it('should only catch the first error only', function () {
      return co(function * () {
        yield function (done) {
          done(new Error('first'))
          throw new Error('second')
        }
      }).then(function () {
        throw new Error('wtf')
      }, function (err) {
        assert.strictEqual(err.message, 'first')
      })
    })
  })

  describe('when an error is passed', function () {
    it('should throw and resume', function () {
      var error

      return co(function * () {
        try {
          yield get(1, new Error('boom'))
        } catch (err) {
          error = err
        }

        assert.strictEqual(error.message, 'boom')
        var ret = yield get(1)
        assert.strictEqual(ret, 1)
      })
    })
  })

  describe('with nested co()s', function () {
    it('should work', function () {
      var hit = []

      return co(function * () {
        var a = yield get(1)
        var b = yield get(2)
        var c = yield get(3)
        hit.push('one')

        assert.deepEqual([a, b, c], [1, 2, 3])

        yield co(function * () {
          hit.push('two')
          var a = yield get(1)
          var b = yield get(2)
          var c = yield get(3)

          assert.deepEqual([a, b, c], [1, 2, 3])

          yield co(function * () {
            hit.push('three')
            var a = yield get(1)
            var b = yield get(2)
            var c = yield get(3)

            assert.deepEqual([a, b, c], [1, 2, 3])
          })
        })

        yield co(function * () {
          hit.push('four')
          var a = yield get(1)
          var b = yield get(2)
          var c = yield get(3)

          assert.deepEqual([a, b, c], [1, 2, 3])
        })

        assert.deepEqual(hit, ['one', 'two', 'three', 'four'])
      })
    })
  })

  describe('return values', function () {
    describe('with a callback', function () {
      it('should be passed', function () {
        return co(function * () {
          return [
            yield get(1),
            yield get(2),
            yield get(3)
          ]
        }).then(function (res) {
          assert.deepEqual(res, [1, 2, 3])
        })
      })
    })

    describe('when nested', function () {
      it('should return the value', function () {
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
          assert.deepEqual(res, [1, 2, 3, 4, 5, 6])
        })
      })
    })
  })

  describe('when yielding neither a function nor a promise', function () {
    it('should throw', function () {
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

        assert.strictEqual(errors.length, 2)
        var msg = 'yield a function, promise, generator, array, or object'
        assert.strictEqual(errors[0].indexOf(msg) !== -1, true)
        assert.strictEqual(errors[1].indexOf(msg) !== -1, true)
        assert.strictEqual(a, 'a')
        assert.strictEqual(b, 'b')
      })
    })
  })

  describe('with errors', function () {
    it('should throw', function () {
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

        assert.deepEqual(errors, ['foo', 'bar'])
        assert.strictEqual(a, 'a')
        assert.strictEqual(b, 'b')
      })
    })

    it('should catch errors on .send()', function () {
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

        assert.deepEqual(errors, ['foo', 'bar'])
        assert.strictEqual(a, 'a')
        assert.strictEqual(b, 'b')
      })
    })

    it('should pass future errors to the callback', function () {
      return co(function * () {
        yield get(1)
        yield get(2, null, new Error('fail'))
        assert(false)
        yield get(3)
      }).catch(function (err) {
        assert.strictEqual(err.message, 'fail')
      })
    })

    it('should pass immediate errors to the callback', function () {
      return co(function * () {
        yield get(1)
        yield get(2, new Error('fail'))
        assert(false)
        yield get(3)
      }).catch(function (err) {
        assert.strictEqual(err.message, 'fail')
      })
    })

    it('should catch errors on the first invocation', function () {
      return co(function * () {
        throw new Error('fail')
      }).catch(function (err) {
        assert.strictEqual(err.message, 'fail')
      })
    })
  })
})
