'use strict'
var test = require('assertit')
var assert = require('assert')
var co = require('../../index')
var describe = test.describe
var it = test.it

describe('co(gen, args)', function () {
  it('should pass the rest of the arguments', function () {
    return co(function * (num, str, arr, obj, fun) {
      assert.strictEqual(num, 42)
      assert.strictEqual(str, 'forty-two')
      assert.strictEqual(arr[0], 42)
      assert.strictEqual(obj.value, 42)
      assert.strictEqual(fun instanceof Function, true)
    }, 42, 'forty-two', [42], { value: 42 }, function () {})
  })
})
