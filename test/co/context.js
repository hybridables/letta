'use strict'

var test = require('mukla')
var co = require('../../index')

var ctx = {
  some: 'thing'
}

test('co.call(this): should pass the context', function () {
  return co.call(ctx, function * () {
    test.deepEqual(ctx, this)
  })
})
