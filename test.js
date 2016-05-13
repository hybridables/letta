/*!
 * letta <https://github.com/hybridables/letta>
 *
 * Copyright (c) 2015-2016 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

/* jshint asi:true */

'use strict'

var semver = require('semver')

// errors
require('./test/errors')

// callback functions
require('./test/callbacks')

// sync functions
require('./test/sync')

if (semver.gte(process.version, '0.11.13')) {
  // generators
  require('./test/generators')

  // co tests
  var fs = require('fs')
  var path = require('path')
  var dir = path.join(__dirname, 'test', 'co')
  fs.readdirSync(dir).forEach(function (filename) {
    require(path.join(dir, filename))
  })
}
