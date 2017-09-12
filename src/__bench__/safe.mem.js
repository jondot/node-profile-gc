const { iterate } = require('../index')

function a() {
  const arr = []
  arr.push('hello')
}
iterate(a, 20000)
