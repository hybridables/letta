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

function successJsonParse () {
  return JSON.parse('{"foo":"bar"}')
}

function returnFailingJsonParse () {
  return JSON.parse('{"f')
}

function noReturnFailJsonParse () {
  JSON.parse('{"f')
}

function returnArray () {
  return [4, 5, 6]
}

function successReadFile () {
  return fs.readFileSync('package.json', 'utf-8')
}

function failReadFile () {
  return fs.readFileSync('foo-bar')
}

test('should handle result when JSON.parse pass', function () {
  return letta(successJsonParse).then(function (res) {
    test.deepEqual(res, {foo: 'bar'})
  })
})

test('should handle error when JSON.parse fail', function () {
  return letta(returnFailingJsonParse).catch(function (err) {
    test.ifError(!err)
    test.ok(err instanceof Error)
  })
})

test('should handle result when fs.readFileSync pass', function () {
  return letta(successReadFile).then(function (res) {
    test.ok(res.indexOf('"license": "MIT"') !== -1)
  })
})

test('should handle error when fs.readFileSync fail', function () {
  return letta(failReadFile).catch(function (err) {
    test.ifError(!err)
    test.ok(err instanceof Error)
  })
})

test('should handle thrown errors', function () {
  return letta(noReturnFailJsonParse).catch(function (err) {
    test.ifError(!err)
    test.ok(err instanceof Error)
  })
})

test('should pass whole returned array to single argument', function () {
  return letta(returnArray).then(function (arr) {
    test.deepEqual(arr, [4, 5, 6])
  })
})
