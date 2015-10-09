/*!
 * letta <https://github.com/hybridables/letta>
 *
 * Copyright (c) 2015 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

/* jshint asi:true */

'use strict'

var test = require('assertit')
var letta = require('../index')

test('should catch TypeError thrown if not function', function (done) {
  letta(1234).catch(function (err) {
    test.strictEqual(/expect a function/.test(err.message), true)
    done()
  })
})

test('should returned error be passed to `.then` function', function (done) {
  letta(function () {
    return new Error('foo bar baz')
  }).then(function (res) {
    test.ifError(!res)
    test.ok(res instanceof Error)
    test.equal(res.message, 'foo bar baz')
    done()
  })
})

test('should mute all errors and pass them to `.catch` function', function (done) {
  letta(function () {
    foobar // eslint-disable-line no-undef
    return 123
  }).catch(function (err) {
    test.ifError(!err)
    test.ok(err instanceof Error)
    test.equal(err.name, 'ReferenceError')
    done()
  })
})
