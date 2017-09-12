const execa = require('execa')
const { filter, map, drop, last, first } = require('lodash')
const { ema } = require('moving-averages')
const path = require('path')
const profile = node => file => {
  const cwd = process.cwd()
  return execa
    .shell(`${node} --gc_global --trace_gc --expose-gc ${path.join(cwd, file)}`)
    .then(res => {
      const text = res.stdout

      const samples = drop(
        filter(
          map(text.split('\n'), l => {
            const m = l.match(/.* -> (\d+\.\d+) .* MB,.*/)
            return m && m.length > 1 ? parseFloat(m[1]) : null
          })
        ),
        10
      )
      const window = samples.length * 0.1
      const avgs = ema(samples, window)

      const all = last(avgs) - first(avgs)
      return all
    })
}
const iterate = (f, times = 1000) => {
  for (let index = 0; index < times; index++) {
    f()
    global.gc()
  }
}

module.exports = { profile, iterate }
