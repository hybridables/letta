'use strict'

var test = require('mukla')
var co = require('../../index')

test('should throw an error when yield <invalid>', function () {
  return co(function * () {
    try {
      yield null
      throw new Error('lol')
    } catch (err) {
      test.ifError(!err)
      test.strictEqual(err instanceof TypeError, true)
      test.strictEqual(err.message.indexOf('You may only yield') !== -1, true)
    }
  })
})
