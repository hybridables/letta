/*!
 * letta <https://github.com/hybridables/letta>
 *
 * Copyright (c) 2015-2016 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

'use strict'

var fs = require('fs')
var letta = require('../index')

/**
 * handles critical crash errors
 * like `ENOENT` and etc.
 */

letta(fs.readFile, 'foobar.json').catch(function (err) {
  console.error(err.code) // => 'ENOENT'
})

/**
 * handles ReferenceError, SyntaxError and etc.
 */

letta(function () {
  foo // eslint-disable-line no-undef
  return true
}).catch(console.error) // => 'ReferenceError: foo is not defined'
