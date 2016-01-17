/*!
 * letta <https://github.com/hybridables/letta>
 *
 * Copyright (c) 2015-2016 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

/* jshint asi:true */

'use strict'

var test = require('assertit')
var letta = require('../index')

test('should returned error be passed to `.then` function', function (done) {
  letta(function () {
    return new Error('foo bar baz')
  }).then(function (res) {
    test.ifError(!res)
    test.ok(res instanceof Error)
    test.equal(res.message, 'foo bar baz')
    done()
  }, console.log)
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
