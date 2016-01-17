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
 * sync function which accept arguments and retun
 * successful fs.createReadStream
 */

letta(function (fp) {
  return fs.createReadStream(fp)
}, filepath).then(function (stream) {
  console.log(stream) // => ReadStream
})

/**
 * pure sync function that return
 * successful fs.createReadStream
 */

letta(function () {
  return fs.createReadStream(filepath)
}).then(function (stream) {
  console.log(stream) // => ReadStream
})

/**
 * failing stream
 * just giving `fs.createReadStream` function
 * to letta function
 */

letta(fs.createReadStream, 'foobar.json')
.then(function (stream) {
  // always! will be in this `.then`
  // nevermind it fails,
  // combine `letta` with `letta-value` if you expect more
  stream.once('error', function (err) {
    console.log(err.code) // => 'ENOENT'
  })
})

/**
 * letta `fs.createReadStream` function
 */

letta(fs.createReadStream, filepath).then(function (stream) {
  console.log(stream) // => ReadStream
})
