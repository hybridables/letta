/*!
 * letta <https://github.com/hybridables/letta>
 *
 * Copyright (c) 2015 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

'use strict'

var sliced = require('sliced')
var isGenFn = require('is-es6-generator-function')
var getPromise = require('native-or-another')

var letta = module.exports = function letta (fn) {
  var Promize = getPromise(letta.promise)
  var args = sliced(arguments, 1)
  var self = this

  return new Promize(function (resolve, reject) {
    process.once('uncaughtException', reject)
    process.once('unhandledRejection', reject)
    process.on('newListener', function (name) {
      this.removeAllListeners(name)
    })
    if (isGenFn(fn)) {
      require('co').apply(self, [fn].concat(args)).then(resolve, reject)
      return
    }
    require('redolent')(fn).apply(self, args).then(resolve, reject)
  })
}

// just for 100% `co@4` comaptibility
// not needed really, because `letta` accept
// everything, on the fly, by default
letta.wrap = function voaWrap (val) {
  function createPromise () {
    var args = sliced(arguments)
    return letta.apply(this, [val].concat(args))
  }
  createPromise.__generatorFunction__ = val
  return createPromise
}
