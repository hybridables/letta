/*!
 * letta <https://github.com/hybridables/letta>
 *
 * Copyright (c) 2015 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

'use strict'

var letta = require('../index')

/**
 * JSON.stringify without identation
 */

letta(JSON.stringify, {foo: 'bar'}).then(function (data) {
  console.log(data) // => {"foo":"bar"}
}, console.error)

/**
 * JSON.stringify with identation
 */

letta(JSON.stringify, {foo: 'bar'}, null, 2).then(function (data) {
  console.log(data)
  // =>
  // {
  //   "foo": "bar"
  // }
}, console.error)

/**
 * JSON.parse
 */

letta(JSON.parse, '{"foo":"bar"}').then(function (data) {
  console.log(data.foo) // => 'bar'
}, console.error)

/**
 * JSON.parse failing
 */

letta(JSON.parse, {a: 'b'}).catch(function (err) {
  console.log(err) // => [SyntaxError: Unexpected token o]
})
