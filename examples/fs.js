/*!
 * letta <https://github.com/hybridables/letta>
 *
 * Copyright (c) 2015-2016 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

'use strict'

var fs = require('fs')
var path = require('path')
var letta = require('../index')
var filepath = path.join(path.dirname(__dirname), 'package.json')

/**
 * fs.readFileSync
 */

letta(fs.readFileSync, filepath, 'utf-8').then(function (data) {
  console.log(JSON.parse(data).name) // => 'letta'
}, console.error)

/**
 * fs.readFile
 */

letta(fs.readFile, filepath, 'utf-8').then(function (data) {
  console.log(data.indexOf('"license": "MIT"') !== -1) // => true
}, console.error)

/**
 * fs.readFileSync reading buffer
 * shows correct handling of optional arguments
 * for core modules like `fs`
 */

letta(fs.readFileSync, filepath).then(function (buf) {
  console.log(buf) // => '<Buffer 7b 0a 20 ...>'
}, console.error)

/**
 * fs.stat
 */

letta(fs.stat, filepath).then(function (stats) {
  console.log(stats.isFile()) // => true
}, console.error)
