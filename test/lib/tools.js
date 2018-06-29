exports.delay = (after, value) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(value)
    }, after)
  })
}
