/*!
 * letta <https://github.com/hybridables/letta>
 *
 * Copyright (c) 2015-2016 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

/* jshint asi:true */

'use strict'

var fs = require('fs')
var test = require('mukla')
var letta = require('../index')
var semver = require('semver')

function successJsonParse (callback) {
  callback(null, JSON.parse('{"foo":"bar"}'))
}

function notSpreadArrays (callback) {
  callback(null, [1, 2], 3, [4, 5])
}

function twoArgs (callback) {
  callback(null, 1, 2)
}

function failure (callback) {
  callback(new Error('callback error'))
}

function readFile (cb) {
  fs.readFile('package.json', 'utf8', cb)
}

test('should handle a successful callback', function () {
  return letta(successJsonParse).then(function (res) {
    test.deepEqual(res, {foo: 'bar'})
  })
})

test('should handle an errored callback', function () {
  return letta(failure).catch(function (err) {
    test.ifError(!err)
    test.ok(err instanceof Error)
    test.strictEqual(err.message, 'callback error')
  })
})

test('should flatten arguments into array - e.g. cb(null, 1, 2)', function () {
  return letta(twoArgs).then(function (res) {
    var one = res[0]
    var two = res[1]
    test.strictEqual(one, 1)
    test.strictEqual(two, 2)
  })
})

test('should flatten arrays - e.g. cb(null, [1, 2], 3)', function () {
  return letta(notSpreadArrays).then(function (res) {
    var arrOne = res[0]
    var three = res[1]
    var arrTwo = res[2]
    test.deepEqual(arrOne, [1, 2])
    test.strictEqual(three, 3)
    test.deepEqual(arrTwo, [4, 5])
  })
})

test('should handle result of `fs.readFile`', function () {
  return letta(readFile).then(function (res) {
    test.equal(typeof res, 'string')
    test.ok(res.indexOf('"license": "MIT"') !== -1)
  })
})

test('should handle buffer result from `fs.readFile` passed directly', function () {
  return letta(fs.readFile, 'package.json').then(function (res) {
    test.ok(Buffer.isBuffer(res))
    test.ok(res.toString('utf8').indexOf('"license": "MIT"') !== -1)
  })
})

test('should returned promise can access used Promise constructor', function () {
  letta.Promise = require('pinkie')
  var promise = letta(fs.readFile, 'package.json', 'utf8')

  return promise.then(JSON.parse).then(function (data) {
    test.strictEqual(data.name, 'letta')

    // Pinkie constructor if node <= 0.11.12,
    // otherwise native Promise constructor
    test.strictEqual(typeof promise.Promise, 'function')

    if (semver.gte(process.version, '0.11.13')) {
      test.strictEqual(promise.Promise.___bluebirdPromise, undefined)
      test.strictEqual(promise.Promise.___customPromise, undefined)
    } else {
      test.strictEqual(promise.Promise.___bluebirdPromise, undefined)
      test.strictEqual(promise.Promise.___customPromise, true)
    }
  })
})
