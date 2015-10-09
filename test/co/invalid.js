'use strict'
var test = require('assertit')
var assert = require('assert')
var co = require('../../index')
var describe = test.describe
var it = test.it

describe('yield <invalid>', function () {
  it('should throw an error', function () {
    return co(function * () {
      try {
        yield null
        throw new Error('lol')
      } catch (err) {
        assert.ifError(!err)
        assert.strictEqual(err instanceof TypeError, true)
        assert.strictEqual(err.message.indexOf('You may only yield') !== -1, true)
      }
    })
  })
})
