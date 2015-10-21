/*!
 * letta <https://github.com/hybridables/letta>
 *
 * Copyright (c) 2015 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

'use strict'

var letta = require('../index')

/**
 * just treat error as normal value
 * if you want/expect different thing,
 * so.. combine `letta` with `letta-value`
 */

letta(function () {
  return new Error('foo err bar')
}).then(function (res) {
  console.log(res instanceof Error) // => true
  console.log(res.message) // => 'foo err bar'
})

/**
 * just function which throws
 * in some cases
 */

letta(function (foo) {
  if (!foo) {
    throw new Error('err bar')
  }
  return foo
}).catch(function (err) {
  console.log(err.message) // => 'err bar'
})
