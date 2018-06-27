const {test} = require('..')

const delay = (after, value) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(value)
    }, after)
  })
}

let test1
let test2
let test3

test.before(t => {
  t.is(test1, undefined)
  test1 = true
})

test.beforeEach(async () => {
  await delay(1)
  test2 = 1
  test3 = 1
})

test.afterEach(() => {
  test1 = test2 = test3 = undefined
})

test.after(t => {
  t.is(test1, undefined)
  t.is(test2, undefined)
  t.is(test3, undefined)
})

test('1: sync', t => {
  t.is(true, true)
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
