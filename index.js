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

/**
 * > Control flow now and then.
 *
 * **Example**
 *
 * ```js
 * const letta = require('letta')
 *
 * letta((foo, bar, baz) => {
 *   console.log(foo, bar, baz) //=> 'foo, bar, baz'
 *   return foo
 * }, 'foo', 'bar', 'baz')
 * .then(console.log) //=> 'foo'
 * ```
 *
 * @name   letta
 * @param  {Function} `<fn>` also generator function
 * @param  {Mixed}    `[args]`any number of arguments, that will be passed to `fn`
 * @return {Promise}
 * @api public
 */
var letta = module.exports = function letta (fn, args) {
  var self = this
  var Promize = getPromise(letta.promise)
  args = sliced(arguments, 1)

  var promise = new Promize(function (resolve, reject) {
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

  return normalizePromise(promise, Promize)
}

/**
 * > Convert a generator into a regular function that returns a `Promise`.
 *
 * **Example**
 *
 * ```js
 * const letta = require('letta')
 * const fn = letta.wrap(function * (val) {
 *   return yield Promise.resolve(val)
 * })
 *
 * fn(123).then(function (val) {
 *   console.log(val) // => 123
 * }, console.error)
 * ```
 *
 * @name   .wrap
 * @param  {Function} `<fn>` also generator function
 * @return {Function} normal function
 * @api public
 */
letta.wrap = function lettaWrap (fn) {
  function createPromise () {
    var args = sliced(arguments)
    return letta.apply(this, [fn].concat(args))
  }
  createPromise.__generatorFunction__ = fn
  return createPromise
}

/**
 * Inherit and normalize properties
 */

function normalizePromise (promise, Ctor) {
  promise.Prome = Ctor
  promise.___customPromise = Ctor.___customPromise
  promise.___bluebirdPromise = Ctor.___bluebirdPromise
  return promise
}
