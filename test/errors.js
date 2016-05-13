/*!
 * letta <https://github.com/hybridables/letta>
 *
 * Copyright (c) 2015-2016 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

/* jshint asi:true */

'use strict'

var test = require('mukla')
var letta = require('../index')

test('should catch TypeError thrown if not function', function (done) {
  return letta(1234).catch(function (err) {
    test.strictEqual(/expect `fn` be function/.test(err.message), true)
  })
})

test('should returned error be passed to `.then` function', function (done) {
  return letta(function () {
    return new Error('foo bar baz')
  }).then(function (res) {
    test.ifError(!res)
    test.ok(res instanceof Error)
    test.equal(res.message, 'foo bar baz')
  })
})

test('should mute all errors and pass them to `.catch` function', function (done) {
  return letta(function () {
    foobar // eslint-disable-line no-undef
    return 123
  }).catch(function (err) {
    test.ifError(!err)
    test.ok(err instanceof Error)
    test.equal(err.name, 'ReferenceError')
  })
})
