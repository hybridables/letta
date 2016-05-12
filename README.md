# [letta][author-www-url] [![npmjs.com][npmjs-img]][npmjs-url] [![The MIT License][license-img]][license-url] [![npm downloads][downloads-img]][downloads-url]

> Promisify sync, async or generator function, using [relike][]. Kind of promisify, but lower level. Almost fully compatible with co@4 - v0.4.x was passing 100% of its tests.

[![code climate][codeclimate-img]][codeclimate-url] [![standard code style][standard-img]][standard-url] [![travis build status][travis-img]][travis-url] [![coverage status][coveralls-img]][coveralls-url] [![dependency status][david-img]][david-url]

You might also be interested in [relike][], [relike-all][], [relike-value][] and [letta-value][].

## Highlights
> A few features and main points.

- promisify sync, async and generator functions
- lower lever than "promisify" - giving function to 1st argument, the next arguments are passed to it
- thin wrapper around [relike][] package to add support for generators, using [co][]
- almost 100% compatibility with `co@4` - v0.4.x was 100% comaptible and was passing 100% of its tests
- correct detecting async (callback-style) functions
- correct handling of optional arguments, just `fn.length` not works - believe
- great handling of errors, uncaught exceptions, rejections and optional arguments
- never crash, all is silent, listening on `unhandledRejection` and `uncaughtException`
- always stay to the standards and specs
- always use native Promise, you can't trick that
- only using Bluebird, if not other Promise constructor provided through `.Promise` property
- Bluebird or the custom constructor is used only on enviroments that don't have support for native Promise
- works on any nodejs version - from `v0.10.x` to latest `v6+` [Node.js](https://nodejs.org)
- accept and works with javascript internal functions like `JSON.stringify` and `JSON.parse`

## Note
Note that it treats functions as asynchronous, based on [is-async-function][].

Why you should be aware of that? Because if you give async function which don't have last argument called with some of the [common-callback-names][] it will treat that function as synchronous and things may not work as expected.

It's not a problem for most of the cases and for node's native packages, because that's a convention.

## Install
```
npm i letta --save
```

## Usage
> For more use-cases see the [tests](./test.js), [examples](./examples) or the passing [`co@4` tests](./test/co)

```js
const fs = require('fs')
const letta = require('letta')

const promise = letta(function * () {
  let result = yield Promise.resolve(123)
  return result
})

promise.then(value => {
  console.log(value) // => 123
}, err => {
  console.error(err.stack)
})
```

If you want to convert generator function to regular function that returns a Promise use `letta.promisify`

**Example**

```js
const letta = require('letta')
const fn = letta.promisify(function * (number) {
  return yield Promise.resolve(number)
})

fn(456).then(number => {
  console.log(number) // => 456
}, err => {
  console.error(err.stack)
})
```

If you want to promisify **any** type of function, again, just use the `.promisify` method, like you do with [bluebird][].promisify.

```js
const fs = require('fs')
const letta = require('letta')
const readFile = letta.promisify(fs.readFile)

readFile('package.json', 'utf8')
  .then(JSON.parse)
  .then(value => {
    console.log(value.name) // => 'letta'
  })
  .catch(SyntaxError, err => {
    console.error('File had syntax error', err)
  })
  // Catch any other error
  .catch(err => {
    console.error(err.stack)
  })
```

## API

### [letta](index.js#L34)
> Control flow for now and then.

**Params**

* `<fn>` **{Function}**: Regular function (including arrow function) or generator function.    
* `[...args]` **{Mixed}**: Any number of any type of arguments, they are passed to `fn`.    
* `returns` **{Promise}**: Always native Promise if supported on enviroment.  

**Example**

```js
const letta = require('letta')

letta((foo, bar, baz) => {
  console.log(foo, bar, baz) // => 'foo bar baz'
  return foo
}, 'foo', 'bar', 'baz')
.then(console.log) // => 'foo'
```

### [.promisify](index.js#L106)
> Returns a function that will wrap the given `fn`. Instead of taking a callback, the returned function will return a promise whose fate is decided by the callback behavior of the given `fn` node function. The node function should conform to node.js convention of accepting a callback as last argument and calling that callback with error as the first argument and success value on the second argument. – [Bluebird Docs on `.promisify`](http://bluebirdjs.com/docs/api/promise.promisify.html)

**Params**

* `<fn>` **{Function}**: Regular function (including arrow function) or generator function.    
* `[Promize]` **{Function}**: Promise constructor to be used on enviroment where no support for native.    
* `returns` **{Function}**: Promisified function, which always return a Promise when called.  

**Example**

```js
const fs = require('fs')
const letta = require('letta')
const readFile = letta.promisify(fs.readFile)

readFile('package.json', 'utf8')
  .then(JSON.parse)
  .then(value => {
    console.log(value.name) // => 'letta'
  })
  .catch(SyntaxError, err => {
    console.error('File had syntax error', err)
  })
  // Catch any other error
  .catch(err => {
    console.error(err.stack)
  })

// or promisify generator function
const promise = letta(function * () {
  let result = yield Promise.resolve(123)
  return result
})

promise.then(value => {
  console.log(value) // => 123
}, err => {
  console.error(err.stack)
})
```

### `letta.Promise`

While `letta` always trying to use native Promise if available in the enviroment, you can
give a Promise constructor to be used on enviroment where there's no support - for example, old
broswers or node's 0.10 version. By default, `letta` will use and include [bluebird][] on old enviroments,
as it is the fastest implementation of Promises. So, you are able to give Promise constructor, but
it won't be used in modern enviroments - it always will use native Promise, you can't trick that. You
can't give custom promise implementation to be used in any enviroment.

**Example**

```js
var fs = require('fs')
var letta = require('letta')

letta.Promise = require('q') // using `Q` promise on node 0.10
var readFile = letta.promisify(fs.readFile)

readFile('package.json', 'utf8')
  .then(console.log, err => {
    console.error(err.stack)
  })
```

One way to pass a custom Promise constructor is as shown above. But the other way is passing it to `.Promise` of the promisified function, like that

```js
var fs = require('fs')
var letta = require('letta')
var statFile = letta.promisify(fs.stat)

statFile.Promise = require('when') // using `when` promise on node 0.10
statFile('package.json').then(console.log, console.error)
```

One more thing, is that you can access the used Promise and can detect what promise is used. It is easy, just as `promise.Promise` and you'll get it.
Or look for `promise.___bluebirdPromise` and `promise.___customPromise` properties. `.___bluebirdPromise` (yea, with three underscores in front) will be true if enviroment is old and you didn't provide promise constructor to `.Promise`.
So, when you give constructor `.__customPromise` will be true and `.___bluebirdPromise` will be false.

```js
var fs = require('fs')
var letta = require('letta')

var promise = letta(fs.readFile, 'package.json', 'utf8')
promise.then(JSON.parse).then(function (val) {
  console.log(val.name) // => 'letta'
}, console.error)

console.log(promise.Promise) // => used Promise constructor
console.log(promise.___bluebirdPromise) // => `true` on old env, falsey otherwise
console.log(promise.___customPromise) // => `true` when pass `.Promise`, falsey otherwise
```

## Examples
> Few working examples with what can be passed and how `letta` acts.

- Callback functions
- Generator functions
- JSON.stringify
- Synchronous functions
- Exceptions and rejections
- Error handling
- Passing function as last argument

### Callback functions
> Can accept asynchronous (callback) functions as well.

**Example**

```js
const fs = require('fs')
const letta = require('letta')

letta(fs.readFile, 'package.json', 'utf8')
  .then(JSON.parse)
  .then(data => {
    console.log(data.name) // => 'letta'
  }, err => {
    console.error(err.stack)
  })

// callback `fs.stat` function
letta(fs.stat, 'package.json')
  .then(stats => {
    console.log(stats.isFile()) // => true
  }, err => {
    console.error(err.stack)
  })
```

### Generator functions
> Accept generator functions same as `co` and acts like [`co@4`](https://github.com/tj/co).

**Example**

```js
const fs = require('fs')
const letta = require('letta')

letta(function * (filepath) {
  return yield letta(fs.readFile, filepath, 'utf8')
}, 'package.json')
  .then(JSON.parse)
  .then(data => {
    console.log(data.name) // => 'letta'
  }, err => {
    console.error(err.stack)
  })
```

### JSON.stringify
> Specific use-case which shows correct handling of optional arguments.

```js
const letta = require('letta')

letta(JSON.stringify, { foo: 'bar' })
  .then(data => {
    console.log(data) // => {"foo":"bar"}
  }, console.error)

// result with identation
letta(JSON.stringify, {foo: 'bar'}, null, 2)
  .then(data => {
    console.log(data)
    // =>
    // {
    //   "foo": "bar"
    // }
  }, console.error)
```

### Synchronous functions
> Again, showing correct handling of optinal arguments using native `fs` module.

```js
const fs = require('fs')
const letta = require('letta')

// sync function
letta(fs.statSync, 'package.json')
  .then(stats => {
    console.log(stats.isFile()) // => true
  })
  .catch(err => console.error(err.stack))

// correct handling of optional arguments
letta(fs.readFileSync, 'package.json')
  .then(buf => {
    console.log(Buffer.isBuffer(buf)) // => true
  })
  .catch(err => {
    console.error(err.stack)
  })
```

### Exceptions and rejections
> Handles `uncaughtException` and `unhandledRejection` by default.

**Example**

```js
const fs = require('fs')
const letta = require('letta')

letta(fs.readFile, 'foobar.json')
  .then(console.log, err => {
    console.error(err.code) // => 'ENOENT'
  })

// handles ReferenceError,
// SyntaxError and etc
const promise = letta(function () {
  foo
  return true
})

promise.catch(err => {
  console.error(err) // => 'ReferenceError: foo is not defined'
})
```

### Error handling
> You should **notice** that if some function **returns** instance of `Error` it will acts as usual - receive it in `.then` not in `.catch`. Review the `examples/errors.js` example.

**Example**

```js
const letta = require('letta')

const promise = letta(function () {
  return new Error('foo err bar')
})

promise.then(errorAsResultValue => {
  console.log(errorAsResultValue instanceof Error) // => true
  console.log(errorAsResultValue.message) // => 'foo err bar'
})
```

### Passing function as last argument
> You can also pass normal (non-callback) function as last argument without problem. It won't be assumed as callback, until you name it or have argument with some of [common-callback-names][].

**Example**

```js
const assert = require('assert')
const letta = require('letta')

function regular (str, num, obj, fn) {
  assert.strictEqual(str, 'foo')
  assert.strictEqual(num, 123)
  assert.deepEqual(obj, { a: 'b' })
  assert.strictEqual(typeof str, 'string')
  assert.strictEqual(typeof num, 'number')
  assert.strictEqual(typeof obj, 'object')
  assert.strictEqual(typeof fn, 'function')
  return obj
}

letta(regular, 'foo', 123, {a: 'b'}, function someFn () {})
  .then(result => {
    console.log(result) // => { a: 'b' }
  })
```

## Contributing
Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](https://github.com/hybridables/letta/issues/new).
But before doing anything, please read the [CONTRIBUTING.md](./CONTRIBUTING.md) guidelines.

## [Charlike Make Reagent](http://j.mp/1stW47C) [![new message to charlike][new-message-img]][new-message-url] [![freenode #charlike][freenode-img]][freenode-url]

[![tunnckoCore.tk][author-www-img]][author-www-url] [![keybase tunnckoCore][keybase-img]][keybase-url] [![tunnckoCore npm][author-npm-img]][author-npm-url] [![tunnckoCore twitter][author-twitter-img]][author-twitter-url] [![tunnckoCore github][author-github-img]][author-github-url]

[bluebird]: https://github.com/petkaantonov/bluebird
[co]: https://github.com/tj/co
[common-callback-names]: https://github.com/tunnckocore/common-callback-names
[is-async-function]: https://github.com/tunnckocore/is-async-function
[letta-value]: https://github.com/hybridables/letta-value
[relike]: https://github.com/hybridables/relike
[relike-all]: https://github.com/hybridables/relike-all
[relike-value]: https://github.com/hybridables/relike-value

[npmjs-url]: https://www.npmjs.com/package/letta
[npmjs-img]: https://img.shields.io/npm/v/letta.svg?label=letta

[license-url]: https://github.com/hybridables/letta/blob/master/LICENSE
[license-img]: https://img.shields.io/npm/l/letta.svg

[downloads-url]: https://www.npmjs.com/package/letta
[downloads-img]: https://img.shields.io/npm/dm/letta.svg

[codeclimate-url]: https://codeclimate.com/github/hybridables/letta
[codeclimate-img]: https://img.shields.io/codeclimate/github/hybridables/letta.svg

[travis-url]: https://travis-ci.org/hybridables/letta
[travis-img]: https://img.shields.io/travis/hybridables/letta/master.svg

[coveralls-url]: https://coveralls.io/r/hybridables/letta
[coveralls-img]: https://img.shields.io/coveralls/hybridables/letta.svg

[david-url]: https://david-dm.org/hybridables/letta
[david-img]: https://img.shields.io/david/hybridables/letta.svg

[standard-url]: https://github.com/feross/standard
[standard-img]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg

[author-www-url]: http://www.tunnckocore.tk
[author-www-img]: https://img.shields.io/badge/www-tunnckocore.tk-fe7d37.svg

[keybase-url]: https://keybase.io/tunnckocore
[keybase-img]: https://img.shields.io/badge/keybase-tunnckocore-8a7967.svg

[author-npm-url]: https://www.npmjs.com/~tunnckocore
[author-npm-img]: https://img.shields.io/badge/npm-~tunnckocore-cb3837.svg

[author-twitter-url]: https://twitter.com/tunnckoCore
[author-twitter-img]: https://img.shields.io/badge/twitter-@tunnckoCore-55acee.svg

[author-github-url]: https://github.com/tunnckoCore
[author-github-img]: https://img.shields.io/badge/github-@tunnckoCore-4183c4.svg

[freenode-url]: http://webchat.freenode.net/?channels=charlike
[freenode-img]: https://img.shields.io/badge/freenode-%23charlike-5654a4.svg

[new-message-url]: https://github.com/tunnckoCore/ama
[new-message-img]: https://img.shields.io/badge/ask%20me-anything-green.svg
