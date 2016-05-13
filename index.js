/*!
 * letta <https://github.com/hybridables/letta>
 *
 * Copyright (c) 2015-2016 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

'use strict'

var utils = require('./utils')

/**
 * > Control flow for now and then.
 *
 * **Example**
 *
 * ```js
 * const letta = require('letta')
 *
 * letta((foo, bar, baz) => {
 *   console.log(foo, bar, baz) // => 'foo bar baz'
 *   return foo
 * }, 'foo', 'bar', 'baz')
 * .then(console.log) // => 'foo'
 * ```
 *
 * @name   letta
 * @param  {Function} `<fn>` Regular function (including arrow function) or generator function.
 * @param  {Mixed} `[...args]` Any number of any type of arguments, they are passed to `fn`.
 * @return {Promise} Always native Promise if supported on enviroment.
 * @api public
 */

var letta = module.exports = function letta (fn, args) {
  var self = this
  var Promize = utils.nativeOrAnother(letta.Promise)
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
    utils.relike.Promise = letta.Promise
    utils.relike.apply(self, [fn].concat(args)).then(resolve, reject)
  })

  return utils.normalizePromise(promise, Promize)
}

/**
 * > Returns a function that will wrap the given `fn`.
 * Instead of taking a callback, the returned function will
 * return a promise whose fate is decided by the callback
 * behavior of the given `fn` node function. The node function
 * should conform to node.js convention of accepting a callback
 * as last argument and calling that callback with error as the
 * first argument and success value on the second argument.
 * – [Bluebird Docs on `.promisify`](http://bluebirdjs.com/docs/api/promise.promisify.html)
 *
 * **Example**
 *
 * ```js
 * const fs = require('fs')
 * const letta = require('letta')
 * const readFile = letta.promisify(fs.readFile)
 *
 * readFile('package.json', 'utf8')
 *   .then(JSON.parse)
 *   .then(value => {
 *     console.log(value.name) // => 'letta'
 *   })
 *   .catch(SyntaxError, err => {
 *     console.error('File had syntax error', err)
 *   })
 *   // Catch any other error
 *   .catch(err => {
 *     console.error(err.stack)
 *   })
 *
 * // or promisify generator function
 * const promise = letta(function * () {
 *   let result = yield Promise.resolve(123)
 *   return result
 * })
 *
 * promise.then(value => {
 *   console.log(value) // => 123
 * }, err => {
 *   console.error(err.stack)
 * })
 * ```
 *
 * @name   .promisify
 * @param  {Function} `<fn>` Regular function (including arrow function) or generator function.
 * @param  {Function} `[Promize]` Promise constructor to be used on enviroment where no support for native.
 * @return {Function} Promisified function, which always return a Promise when called.
 * @api public
 */

letta.promisify = letta.wrap = function lettaPromisify (fn, Promize) {
  var self = this
  function promisified () {
    letta.Promise = Promize || lettaPromisify.Promise || promisified.Promise
    return letta.apply(this || self, [fn].concat(utils.sliced(arguments)))
  }
  promisified.__generatorFunction__ = fn
  return promisified
}
