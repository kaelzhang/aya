[![Build Status](https://travis-ci.org/kaelzhang/aya.svg?branch=master)](https://travis-ci.org/kaelzhang/aya)
[![Coverage](https://codecov.io/gh/kaelzhang/aya/branch/master/graph/badge.svg)](https://codecov.io/gh/kaelzhang/aya)
<!-- optional appveyor tst
[![Windows Build Status](https://ci.appveyor.com/api/projects/status/github/kaelzhang/aya?branch=master&svg=true)](https://ci.appveyor.com/project/kaelzhang/aya)
-->
<!-- optional npm version
[![NPM version](https://badge.fury.io/js/aya.svg)](http://badge.fury.io/js/aya)
-->
<!-- optional npm downloads
[![npm module downloads per month](http://img.shields.io/npm/dm/aya.svg)](https://www.npmjs.org/package/aya)
-->
<!-- optional dependency status
[![Dependency Status](https://david-dm.org/kaelzhang/aya.svg)](https://david-dm.org/kaelzhang/aya)
-->

# aya

![aya](https://raw.githubusercontent.com/kaelzhang/aya/master/aya.gif)

Just a wrapped [tap](https://www.npmjs.com/package/tap), more fun.

## Install

```sh
$ npm i -D aya
```

## Usage

package.json

```js
{
  "scripts": {
    "test": "aya test/index.js --coverage"
  }
}
```

test/index.js

```js
const {test} = require('aya')

test.before(() => {
  // some setup
})

test('description', async t => {
  const result = await getResult()
  t.is(result, true)
})
```

And then

```sh
$ npm test
```

### `t.end()` only in `test.cb`

Unlike `tap`, we should only use `t.end()` in `test.cb`.

```js
test.cb('test result with callback', t => {
  getResult(result => {
    t.is(result, true)
    t.end()
  })
})
```

### `t.end()` is NO MORE necessary for `test`

```js
test('sync test', t => {
  const result = getSyncResult()
  t.is(result, true)
})

test('async test', async t => {
  const result = await getAsyncResult()
  t.is(result, true)

  // t.end() here is useless and has no effect.
})
```

### Lifecycles

`aya` supports FOUR lifecycle methods which are listed below according to the executing sequence:

- `test.before(fn)`
- `test.beforeEach(fn)`
- `test.afterEach(fn)`
- `test.after(fn)`

```js
// Both sync and async functions are supported
test.before(async t => {
  await startServer()

  // We could do assertions inside lifecycle methods
  t.is(await getServerPort(), 8080)
})
```

We could also define lifecycle methods by using setters:

```js
test.before = async t => {
  await startServer()
  t.is(await getServerPort(), 8080)
}
```

## Command Line

The command line interface of `aya` is exactly the same as [`tap`](https://www.npmjs.com/package/tap).

For example, if we want to use `aya` with `codecov`

```sh
$ npm i -D aya codecov
```

package.json

```js
{
  "scripts": {
    "test": "aya test/index.js --coverage",
    "posttest": "aya --coverage-report=html && codecov"
  }
}
```

## License

MIT
