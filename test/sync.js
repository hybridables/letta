/*!
 * letta <https://github.com/hybridables/letta>
 *
 * Copyright (c) 2015-2016 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

/* jshint asi:true */

'use strict'

var fs = require('fs')
var test = require('assertit')
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

test('should handle result when JSON.parse pass', function (done) {
  letta(successJsonParse).then(function (res) {
    test.deepEqual(res, {foo: 'bar'})
    done()
  }, done)
})

test('should handle error when JSON.parse fail', function (done) {
  letta(returnFailingJsonParse).catch(function (err) {
    test.ifError(!err)
    test.ok(err instanceof Error)
    done()
  })
})

test('should handle result when fs.readFileSync pass', function (done) {
  letta(successReadFile).then(function (res) {
    test.ok(res.indexOf('"license": "MIT"') !== -1)
    done()
  }, done)
})

test('should handle error when fs.readFileSync fail', function (done) {
  letta(failReadFile).catch(function (err) {
    test.ifError(!err)
    test.ok(err instanceof Error)
    done()
  })
})

test('should handle thrown errors', function (done) {
  letta(noReturnFailJsonParse).catch(function (err) {
    test.ifError(!err)
    test.ok(err instanceof Error)
    done()
  })
})

test('should pass whole returned array to single argument', function (done) {
  letta(returnArray).then(function (arr) {
    test.deepEqual(arr, [4, 5, 6])
    done()
  })
})
