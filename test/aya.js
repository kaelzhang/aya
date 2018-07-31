const {test} = require('..')
const {delay} = require('./lib/tools')

let test1
let test2
let test3

test.before(async t => {
  t.is(test1, undefined)

  test1 = await delay(10, true)
})

test.beforeEach(async () => {
  await delay(1)
  test2 = 1
  test3 = 1
})

test.afterEach(() => {
  test1 = test2 = test3 = undefined
})

test.afterEach(null)

test.after(t => {
  t.is(test1, true)
  t.is(test2, 1)
  t.is(test3, 1)
})

test('1: sync', t => {
  t.is(true, test1)
})

test('2: async', async t => {
  const r = await delay(2, 1)
  t.is(r, test2)
})

test.cb('3: cb', t => {
  delay(2, 1).then(r => {
    t.is(r, test3)
    t.end()
  })
})
