const {test} = require('..')
const {delay} = require('./lib/tools')

let a

test.before = () => {
  a = {
    value () {
      return 1
    }
  }
}

test('spec after before', t => {
  t.is(a.value(), 1)
})
