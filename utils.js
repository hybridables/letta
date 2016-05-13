'use strict'

/**
 * Module dependencies
 */

var utils = require('lazy-cache')(require)

/**
 * Temporarily re-assign `require` to trick browserify and
 * webpack into reconizing lazy dependencies.
 *
 * This tiny bit of ugliness has the huge dual advantage of
 * only loading modules that are actually called at some
 * point in the lifecycle of the application, whilst also
 * allowing browserify and webpack to find modules that
 * are depended on but never actually called.
 */

var fn = require
require = utils // eslint-disable-line no-undef, no-native-reassign

/**
 * Lazily required module dependencies
 */

require('co')
require('is-es6-generator-function', 'isGenFn')
require('native-or-another')
require('relike')
require('sliced')

/**
 * Restore `require`
 */

require = fn // eslint-disable-line no-undef, no-native-reassign

utils.normalizePromise = function normalizePromise (promise, Promize) {
  promise.Promise = Promize
  promise.___customPromise = promise.Promise.___customPromise
  promise.___bluebirdPromise = promise.Promise.___bluebirdPromise
  return promise
}

/**
 * Expose `utils` modules
 */

module.exports = utils
