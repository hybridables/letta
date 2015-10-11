# [letta][author-www-url] [![npmjs.com][npmjs-img]][npmjs-url] [![The MIT License][license-img]][license-url] 

> Let's move to promises! Drop-in replacement for `co@4`, but on steroids. Accepts sync, async and generator functions.

[![code climate][codeclimate-img]][codeclimate-url] [![standard code style][standard-img]][standard-url] [![travis build status][travis-img]][travis-url] [![coverage status][coveralls-img]][coveralls-url] [![dependency status][david-img]][david-url]


## Install
```
npm i letta --save
```


## Usage
> For more use-cases see the [tests](./test.js)

```js
const letta = require('letta')
```

### [letta](./index.js#L35)
> Control flow now and then.

- `<fn>` **{Function}** also generator function
- `[args]` **{Mixed}** any number of arguments, that will be passed to `fn`
- `return` **{Promise}**

**Example**

```js
const letta = require('letta')

letta((foo, bar, baz) => {
  console.log(foo, bar, baz) //=> 'foo, bar, baz'
  return foo
}, 'foo', 'bar', 'baz')
.then(console.log) //=> 'foo'
```

### Callbacks
> Can accept asynchronous (callback) functions as well.

**Example**

```js
const fs = require('fs')
const letta = require('letta')

letta(fs.readFile, 'package.json', 'utf8')
.then(JSON.parse)
.then(data => {
  console.log(data.name) //=> 'letta'
}, console.error)

// callback `fs.stat` function
letta(fs.stat, 'package.json')
.then(stats => {
  console.log(stats.isFile()) //=> true
}, console.error)
```

### Generators
> Accept generator functions same as `co` and acts like [`co@4`](https://github.com/tj/co).

**Example**

```js
const fs = require('fs')
const letta = require('letta')

letta(function * (fp) {
  return yield letta(fs.readFile, fp, 'utf8')
}, 'package.json')
.then(JSON.parse)
.then(data => {
  console.log(data.name) //=> 'letta'
}, console.error)
```

### JSON.stringify
> Specific use-case which shows correct and working handling of optional arguments.

```js
const letta = require('letta')

letta(JSON.stringify, {foo: 'bar'})
.then(data => {
  console.log(data) //=> {"foo":"bar"}
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

### Sync functions
> Again, showing correct handling of optinal arguments using native `fs` module.

```js
const fs = require('fs')
const letta = require('letta')

// sync function
letta(fs.statSync, 'package.json')
.then(stats => {
  console.log(stats.isFile()) //=> true
}, console.error)

// correct handling of optional arguments
letta(fs.readFileSync, 'package.json')
.then(buf => {
  console.log(Buffer.isBuffer(buf)) //=> true
}, console.error)
```

### Exceptions and rejections
> Handles `uncaughtException` and `unhandledRejection` by default.

**Example**

```js
const fs = require('fs')
const letta = require('letta')

letta(fs.readFile, 'foobar.json')
.then(console.log, err => {
  console.error(err.code) //=> 'ENOENT'
})

// handles ReferenceError,
// SyntaxError and etc
letta(function () {
  foo
  return true
})
.catch(console.error) //=> 'ReferenceError: foo is not defined'
```

### Errors
> You should **notice** that if some function **returns** instance of `Error` it will acts like error is thrown from that function.

**Example**

```js
const letta = require('letta')

letta(function () {
  return new Error('foo err bar')
})
.catch(err => {
  console.log(err.message) //=> 'foo err bar'
})
```

So above is same as if you throw some error as you normally will do.

```js
const letta = require('letta')

letta(function (foo) {
  if (!foo) {
    throw new Error('foo err bar')
  }
  return foo
})
.then(console.log, err => {
  console.log(err.message) //=> 'foo err bar'
})
```

### Last argument function
> You can also pass normal (non-callback) function as last argument without problem. It won't be assumed as callback, until you name it or have argument named `cb`, `callback`, `next`, `done`.

**Example**

```js
const assert = require('assert')
const letta = require('letta')

letta((str, num, obj, fn) => {
  assert.strictEqual(str, 'foo')
  assert.strictEqual(num, 123)
  assert.deepEqual(obj, {a: 'b'})
  assert.strictEqual(typeof str, 'string')
  assert.strictEqual(typeof num, 'number')
  assert.strictEqual(typeof obj, 'object')
  assert.strictEqual(typeof fn, 'function')
  return true
}, 'foo', 123, {a: 'b'}, function () {})
.then(console.log) //=> true
```

## Contributing
Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](https://github.com/hybridables/letta/issues/new).  
But before doing anything, please read the [CONTRIBUTING.md](./CONTRIBUTING.md) guidelines.


## [Charlike Make Reagent](http://j.mp/1stW47C) [![new message to charlike][new-message-img]][new-message-url] [![freenode #charlike][freenode-img]][freenode-url]

[![tunnckocore.tk][author-www-img]][author-www-url] [![keybase tunnckocore][keybase-img]][keybase-url] [![tunnckoCore npm][author-npm-img]][author-npm-url] [![tunnckoCore twitter][author-twitter-img]][author-twitter-url] [![tunnckoCore github][author-github-img]][author-github-url]


[npmjs-url]: https://www.npmjs.com/package/letta
[npmjs-img]: https://img.shields.io/npm/v/letta.svg?label=letta

[license-url]: https://github.com/hybridables/letta/blob/master/LICENSE.md
[license-img]: https://img.shields.io/badge/license-MIT-blue.svg


[codeclimate-url]: https://codeclimate.com/github/hybridables/letta
[codeclimate-img]: https://img.shields.io/codeclimate/github/hybridables/letta.svg

[travis-url]: https://travis-ci.org/hybridables/letta
[travis-img]: https://img.shields.io/travis/hybridables/letta.svg

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