'use strict'
var test = require('assertit')
var assert = require('assert')
var co = require('../../index')
var describe = test.describe
var it = test.it

var ctx = {
  some: 'thing'
}

describe('co.call(this)', function () {
  it('should pass the context', function () {
    return co.call(ctx, function * () {
      assert.deepEqual(ctx, this)
    })
  })
})
