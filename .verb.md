# [{%= name %}][author-www-url] [![npmjs.com][npmjs-img]][npmjs-url] [![The MIT License][license-img]][license-url] [![npm downloads][downloads-img]][downloads-url]

> {%= description %}

[![code climate][codeclimate-img]][codeclimate-url] [![standard code style][standard-img]][standard-url] [![travis build status][travis-img]][travis-url] [![coverage status][coveralls-img]][coveralls-url] [![dependency status][david-img]][david-url]

You might also be interested in [relike][], [relike-all][], [relike-value][] and [{%= varname %}-value][].

## Table Of Contents
<!-- toc -->

## Highlights
> A few features and main points.

- promisify sync, async and generator functions
- lower lever than "promisify" - giving function to 1st argument, the next arguments are passed to it
- thin wrapper around [relike][] package to add support for generators, using [co][]
- full compatibility with `co@4` and passing 100% of its tests
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

## Notes

### Sync and async functions
Note that it treats functions as asynchronous, based on [is-async-function][].

Why you should be aware of that? Because if you give async function which don't have last argument called with some of the [common-callback-names][] it will treat that function as synchronous and things may not work as expected.

It's not a problem for most of the cases and for node's native packages, because that's a convention.

### Absolutely silent - never crash
Using `letta` you should be absolutely careful. Because it makes your application absolutely silent. Which means
if you have some `ReferenceError` or something like it, after the execution of `letta` it will be muted. And the
only way to handle it is through `.catch` from the returned promise.

Let's visualise it. In the following examples we'll use [relike][] first and then `letta`, and you can see the differences.

```js
var relike = require('relike')
var promise = relike(function () {
  return 123
})

promise.then(console.log, err => {
  console.error(err.stack)
  // => errors only happened in function wrapped by relike
})

foo
// => throws ReferenceError directly, immediately
// and your application will crash
```

But the things, using `letta` are little bit different, because we have listeners on `unhandledRejection` and
on `uncaughtException` events. The same example from above, using `letta`


```js
var letta = require('letta')
var promise = letta(function () {
  return 123
})

promise.then(console.log, err => {
  console.error(err.stack)
  // => ReferenceError: foo is not defined
})

foo
// => never throws directly, never crash
// this error should be handled from the promise
```

So, if you don't want this behavior, you should use [relike][]. But if you want generators support, you should
do some little wrapper for [relike][].

## Install
```
npm i {%= name %} --save
```

## Usage
> For more use-cases see the [tests](./test.js), [examples](./examples) or all the passing [`co@4` tests](./test/co)

```js
const fs = require('fs')
const {%= varname %} = require('{%= name %}')

const promise = {%= varname %}(function * () {
  let result = yield Promise.resolve(123)
  return result
})

promise.then(value => {
  console.log(value) // => 123
}, err => {
  console.error(err.stack)
})
```

If you want to convert generator function to regular function that returns a Promise use [{%= varname %}.promisify](#promisify)

**Example**

```js
const {%= varname %} = require('{%= name %}')
const fn = {%= varname %}.promisify(function * (number) {
  return yield Promise.resolve(number)
})

fn(456).then(number => {
  console.log(number) // => 456
}, err => {
  console.error(err.stack)
})
```

If you want to promisify **any** type of function, again, just use the [.promisify](#promisify) method, like you do with [bluebird][].promisify.

```js
const fs = require('fs')
const {%= varname %} = require('{%= name %}')
const readFile = {%= varname %}.promisify(fs.readFile)

readFile('package.json', 'utf8')
  .then(JSON.parse)
  .then(value => {
    console.log(value.name) // => '{%= varname %}'
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
{%= apidocs('index.js') %}

### .Promise

While `{%= varname %}` always trying to use native Promise if available in the enviroment, you can
give a Promise constructor to be used on enviroment where there's no support - for example, old
broswers or node's 0.10 version. By default, `{%= varname %}` will use and include [bluebird][] on old enviroments,
as it is the fastest implementation of Promises. So, you are able to give Promise constructor, but
it won't be used in modern enviroments - it always will use native Promise, you can't trick that. You
can't give custom promise implementation to be used in any enviroment.

**Example**

```js
var fs = require('fs')
var {%= varname %} = require('{%= varname %}')

{%= varname %}.Promise = require('q') // using `Q` promise on node 0.10
var readFile = {%= varname %}.promisify(fs.readFile)

readFile('package.json', 'utf8')
  .then(console.log, err => {
    console.error(err.stack)
  })
```

One way to pass a custom Promise constructor is as shown above. But the other way is passing it to `.Promise` of the promisified function, like that

```js
var fs = require('fs')
var {%= varname %} = require('{%= varname %}')
var statFile = {%= varname %}.promisify(fs.stat)

statFile.Promise = require('when') // using `when` promise on node 0.10
statFile('package.json').then(console.log, console.error)
```

One more thing, is that you can access the used Promise and can detect what promise is used. It is easy, just as `promise.Promise` and you'll get it.
Or look for `promise.___bluebirdPromise` and `promise.___customPromise` properties. `.___bluebirdPromise` (yea, with three underscores in front) will be true if enviroment is old and you didn't provide promise constructor to `.Promise`.
So, when you give constructor `.__customPromise` will be true and `.___bluebirdPromise` will be false.

```js
var fs = require('fs')
var {%= varname %} = require('{%= varname %}')

var promise = {%= varname %}(fs.readFile, 'package.json', 'utf8')
promise.then(JSON.parse).then(function (val) {
  console.log(val.name) // => '{%= varname %}'
}, console.error)

console.log(promise.Promise) // => used Promise constructor
console.log(promise.___bluebirdPromise) // => `true` on old env, falsey otherwise
console.log(promise.___customPromise) // => `true` when pass `.Promise`, falsey otherwise
```

## Examples
> Few working examples with what can be passed and how `{%= varname %}` acts.

- Callback functions
- Generator functions
- JSON.stringify
- Synchronous functions
- Exceptions and rejections
- Returning errors
- Passing function as last argument

### Callback functions
> Can accept asynchronous (callback) functions as well.

**Example**

```js
const fs = require('fs')
const {%= varname %} = require('{%= varname %}')

{%= varname %}(fs.readFile, 'package.json', 'utf8')
  .then(JSON.parse)
  .then(data => {
    console.log(data.name) // => '{%= varname %}'
  }, err => {
    console.error(err.stack)
  })

// callback `fs.stat` function
{%= varname %}(fs.stat, 'package.json')
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
const {%= varname %} = require('{%= varname %}')

{%= varname %}(function * (filepath) {
  return yield {%= varname %}(fs.readFile, filepath, 'utf8')
}, 'package.json')
  .then(JSON.parse)
  .then(data => {
    console.log(data.name) // => '{%= varname %}'
  }, err => {
    console.error(err.stack)
  })
```

### JSON.stringify
> Specific use-case which shows correct handling of optional arguments.

```js
const {%= varname %} = require('{%= varname %}')

{%= varname %}(JSON.stringify, { foo: 'bar' })
  .then(data => {
    console.log(data) // => {"foo":"bar"}
  }, console.error)

// result with identation
{%= varname %}(JSON.stringify, {foo: 'bar'}, null, 2)
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
const {%= varname %} = require('{%= varname %}')

// sync function
{%= varname %}(fs.statSync, 'package.json')
  .then(stats => {
    console.log(stats.isFile()) // => true
  })
  .catch(err => console.error(err.stack))

// correct handling of optional arguments
{%= varname %}(fs.readFileSync, 'package.json')
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
const {%= varname %} = require('{%= varname %}')

{%= varname %}(fs.readFile, 'foobar.json')
  .then(console.log, err => {
    console.error(err.code) // => 'ENOENT'
  })

// handles ReferenceError,
// SyntaxError and etc
const promise = {%= varname %}(function () {
  foo
  return true
})

promise.catch(err => {
  console.error(err) // => 'ReferenceError: foo is not defined'
})
```

### Returning errors
> You should **notice** that if some function **returns** instance of `Error` it will acts as usual - receive it in `.then` not in `.catch`. Review the `examples/errors.js` example.

**Example**

```js
const {%= varname %} = require('{%= varname %}')

const promise = {%= varname %}(function () {
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
const {%= varname %} = require('{%= varname %}')

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

{%= varname %}(regular, 'foo', 123, {a: 'b'}, function someFn () {})
  .then(result => {
    console.log(result) // => { a: 'b' }
  })
```

{% if (verb.related && verb.related.list && verb.related.list.length) { %}
## Related
{%= related(verb.related.list, {words: 12}) %}
{% } %}

## Contributing
Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](https://github.com/{%= repository %}/issues/new).
But before doing anything, please read the [CONTRIBUTING.md](./CONTRIBUTING.md) guidelines.

## [Charlike Make Reagent](http://j.mp/1stW47C) [![new message to charlike][new-message-img]][new-message-url] [![freenode #charlike][freenode-img]][freenode-url]

[![{%= author.username %}.tk][author-www-img]][author-www-url] [![keybase {%= author.username %}][keybase-img]][keybase-url] [![{%= author.username %} npm][author-npm-img]][author-npm-url] [![{%= author.username %} twitter][author-twitter-img]][author-twitter-url] [![{%= author.username %} github][author-github-img]][author-github-url]

{%= reflinks(verb.reflinks) %}

[npmjs-url]: https://www.npmjs.com/package/{%= name %}
[npmjs-img]: https://img.shields.io/npm/v/{%= name %}.svg?label={%= name %}

[license-url]: https://github.com/{%= repository %}/blob/master/LICENSE
[license-img]: https://img.shields.io/npm/l/{%= name %}.svg

[downloads-url]: https://www.npmjs.com/package/{%= name %}
[downloads-img]: https://img.shields.io/npm/dm/{%= name %}.svg


[codeclimate-url]: https://codeclimate.com/github/{%= repository %}
[codeclimate-img]: https://img.shields.io/codeclimate/github/{%= repository %}.svg

[travis-url]: https://travis-ci.org/{%= repository %}
[travis-img]: https://img.shields.io/travis/{%= repository %}/master.svg

[coveralls-url]: https://coveralls.io/r/{%= repository %}
[coveralls-img]: https://img.shields.io/coveralls/{%= repository %}.svg

[david-url]: https://david-dm.org/{%= repository %}
[david-img]: https://img.shields.io/david/{%= repository %}.svg

[standard-url]: https://github.com/feross/standard
[standard-img]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg


[author-www-url]: http://www.{%= author.username.toLowerCase() %}.tk
[author-www-img]: https://img.shields.io/badge/www-{%= author.username.toLowerCase() %}.tk-fe7d37.svg

[keybase-url]: https://keybase.io/{%= author.username.toLowerCase() %}
[keybase-img]: https://img.shields.io/badge/keybase-{%= author.username.toLowerCase() %}-8a7967.svg

[author-npm-url]: https://www.npmjs.com/~{%= author.username.toLowerCase() %}
[author-npm-img]: https://img.shields.io/badge/npm-~{%= author.username.toLowerCase() %}-cb3837.svg

[author-twitter-url]: https://twitter.com/{%= author.username %}
[author-twitter-img]: https://img.shields.io/badge/twitter-@{%= author.username %}-55acee.svg

[author-github-url]: https://github.com/{%= author.username %}
[author-github-img]: https://img.shields.io/badge/github-@{%= author.username %}-4183c4.svg

[freenode-url]: http://webchat.freenode.net/?channels=charlike
[freenode-img]: https://img.shields.io/badge/freenode-%23charlike-5654a4.svg

[new-message-url]: https://github.com/{%= author.username %}/ama
[new-message-img]: https://img.shields.io/badge/ask%20me-anything-green.svg
