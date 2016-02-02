/*!
 * letta <https://github.com/hybridables/letta>
 *
 * Copyright (c) 2015-2016 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

'use strict'

var utils = require('./utils')

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
 * @param  {Mixed} `[args..]` any number of any type of arguments, if `fn` function they are passed to it
 * @return {Promise}
 * @api public
 */
var letta = module.exports = function letta (fn, args) {
  var self = this
  var Promize = utils.nativeOrAnother(letta.promise)
  args = utils.sliced(arguments, 1)

  var promise = new Promize(function (resolve, reject) {
    process.once('uncaughtException', reject)
    process.once('unhandledRejection', reject)
    process.on('newListener', function (name) {
      this.removeAllListeners(name)
    })
    if (utils.isGenFn(fn)) {
      utils.co.apply(self, [fn].concat(args)).then(resolve, reject)
      return
    }
    utils.relike.promise = letta.promise
    utils.relike.promisify(fn).apply(self, args).then(resolve, reject)
  })

  return normalizePromise(promise, Promize)
}

/**
 * > Wraps a function and returns a function that when is
 * invoked returns Promise. Same as `Bluebird.promisify`.
 *
 * **Example**
 *
 * ```js
 * const letta = require('letta')
 * const fn = letta.promisify(function * (val) {
 *   return yield Promise.resolve(val)
 * })
 *
 * fn(123).then(function (val) {
 *   console.log(val) // => 123
 * }, console.error)
 *
 * // or `.wrap` is alias (co@4 compitability)
 * const fs = require('fs')
 * const readFile = letta.wrap(fs.readFile)
 * readFile('./package.json')
 * .then(JSON.parse).then(console.log, console.error)
 * ```
 *
 * @name   .promisify
 * @param  {Function} `<fn>` also generator function
 * @param  {Function} `[Prome]` custom Promise constructor/module to use, e.g. `Q`
 * @return {Function} promisified function
 * @api public
 */
letta.promisify = letta.wrap = function lettaPromisify (fn, Prome) {
  function promisified () {
    var args = utils.sliced(arguments)
    letta.promise = Prome || lettaPromisify.promise || promisified.promise
    return letta.apply(this, [fn].concat(args))
  }
  promisified.__generatorFunction__ = fn
  return promisified
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
