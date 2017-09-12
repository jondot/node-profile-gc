const { iterate } = require('../index')

const arr = []
function a() {
  arr.push('hello' + Math.random())
}
iterate(a, 20000)
