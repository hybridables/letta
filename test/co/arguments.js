'use strict'

var test = require('mukla')
var co = require('../../index')

test('should pass the rest of the arguments', function () {
  return co(function * (num, str, arr, obj, fun) {
    test.strictEqual(num, 42)
    test.strictEqual(str, 'forty-two')
    test.strictEqual(arr[0], 42)
    test.strictEqual(obj.value, 42)
    test.strictEqual(fun instanceof Function, true)
  }, 42, 'forty-two', [42], { value: 42 }, function () {})
})
