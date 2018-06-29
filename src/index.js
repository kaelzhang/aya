const {test} = require('tap')
const EventEmitter = require('events')

const QUEUED = [
  'test',
  'cb'
]

const LIFE_CYCLES = [
  'beforeEach',
  'before',
  'after',
  'afterEach'
]

const NOOP = () => {}

const wrapAsyncT = t => {
  const ret = {
    end: NOOP
  }

  Object.setPrototypeOf(ret, t)
  return ret
}

const wrapCallbackT = (t, resolve) => {
  const ret = {
    end: resolve
  }

  Object.setPrototypeOf(ret, t)
  return ret
}

const wrapQueue = (self, method) => {
  return (...args) => self._queue.add(() => method.apply(self, args))
}

class Queue extends EventEmitter {
  constructor () {
    super()

    this._triggers = []
    this._tasks = []
  }

  add (runner) {
    const task = new Promise((resolve) => {
      this._triggers.push(resolve)
    })
    .then(() => runner())

    this._tasks.push(task)
    return task
  }

  run () {
    this._triggers.forEach(resolve => resolve())
    const ret = Promise.all(this._tasks)

    this._triggers.length = 0
    this._tasks.length = 0

    return ret
  }
}

const defineLifecycle = (host, target, self) => {
  const key = `_${target}`
  function setter (fn) {
    self[key] = fn
  }

  Object.defineProperty(host, target, {
    get: () => setter,
    set: fn => setter.call(this, fn)
  })
}

class Piapia {
  constructor () {
    this._queue = new Queue()
    this._before = null
    this._after = null
    this._beforeEach = null
    this._afterEach = null

    QUEUED.forEach(m => {
      this[m] = wrapQueue(this, this[m])
    })

    LIFE_CYCLES.forEach(m => {
      defineLifecycle(this.test, m, this)
    })

    this.test.cb = this.cb.bind(this)

    process.nextTick(() => {
      this._run()
    })
  }

  async _run () {
    await this._check('before')
    await this._queue.run()
    await this._check('after')
  }

  _check (target, desc) {
    const fn = this[`_${target}`]
    if (!fn) {
      return
    }

    return this._test(desc || target, fn)
  }

  _test (desc, runner) {
    return test(desc, async t => {
      return Promise.resolve(runner(wrapAsyncT(t)))
    })
  }

  async test (desc, runner) {
    await this._check('beforeEach', `before << ${desc}`)
    await this._test(desc, runner)
    await this._check('afterEach', `after >> ${desc}`)
  }

  async cb (desc, runner) {
    await this._check('beforeEach', `before << ${desc}`)
    await test(desc, async t => {
      return new Promise((resolve) => {
        runner(wrapCallbackT(t, resolve))
      })
    })
    await this._check('afterEach', `after >> ${desc}`)
  }
}

module.exports = {
  get test () {
    return new Piapia().test
  }
}
