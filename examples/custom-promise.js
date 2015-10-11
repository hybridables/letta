/*!
 * letta <https://github.com/hybridables/letta>
 *
 * Copyright (c) 2015 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

'use strict'

var fs = require('fs')
var letta = require('../index')

letta.promise = require('pinkie')
var promise = letta(fs.readFile, 'package.json', 'utf8')

promise.then(JSON.parse).then(function (data) {
  console.log(data.name) // => 'letta'
  console.log(promise.Prome) // => `pinkie` promise constructor

  // shows that custom promise module is used
  console.log(promise.___customPromise)// => true, otherwise `undefined`

  // shows that Blubird promise is not used in this case
  console.log(promise.___bluebirdPromise)// => undefined
})
