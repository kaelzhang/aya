[![Build Status](https://travis-ci.org/kaelzhang/node-piapia.svg?branch=master)](https://travis-ci.org/kaelzhang/node-piapia)
[![Coverage](https://codecov.io/gh/kaelzhang/node-piapia/branch/master/graph/badge.svg)](https://codecov.io/gh/kaelzhang/node-piapia)
<!-- optional appveyor tst
[![Windows Build Status](https://ci.appveyor.com/api/projects/status/github/kaelzhang/node-piapia?branch=master&svg=true)](https://ci.appveyor.com/project/kaelzhang/node-piapia)
-->
<!-- optional npm version
[![NPM version](https://badge.fury.io/js/piapia.svg)](http://badge.fury.io/js/piapia)
-->
<!-- optional npm downloads
[![npm module downloads per month](http://img.shields.io/npm/dm/piapia.svg)](https://www.npmjs.org/package/piapia)
-->
<!-- optional dependency status
[![Dependency Status](https://david-dm.org/kaelzhang/node-piapia.svg)](https://david-dm.org/kaelzhang/node-piapia)
-->

# piapia

Just a wrapper of [tap](https://www.npmjs.com/package/tap), making testing more fun.

## Install

```sh
$ npm i -D piapia
```

## Usage

package.json

```js
{
  "scripts": {
    "test": "piapia test/index.js --coverage"
  }
}
```

test/index.js

```js
const {test} = require('piapia')

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

`piapia` supports FOUR lifecycle methods which are listed below according to the executing sequence:

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

## Command Line

The command line interface of `piapia` is exactly the same as [`tap`](https://www.npmjs.com/package/tap).

For example, if we want to use `piapia` with `codecov`

```sh
$ npm i -D piapia codecov
```

package.json

```js
{
  "scripts": {
    "test": "piapia test/index.js --coverage",
    "posttest": "piapia --coverage-report=html && codecov"
  }
}
```

## License

MIT
