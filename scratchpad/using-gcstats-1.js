import foobanzle from '../index'
import v8 from 'v8'
import zipWith from 'lodash/zipWith'
import mapValues from 'lodash/mapValues'
import isString from 'lodash/isString'
import omitBy from 'lodash/omitBy'
import map from 'lodash/map'
import filter from 'lodash/filter'
import times from 'lodash/times'
import drop from 'lodash/drop'
import reduce from 'lodash/reduce'
import tail from 'lodash/tail'

const substats = (a, b) => mapValues(b, (v, k) => (isString(v) ? v : v - a[k]))
const heapdiff = (before, after) => zipWith(before, after, substats)

const diffReporter = detected => {
  return map(
    detected,
    c =>
      `${c.space_name}: ${c.space_used_size > 0
        ? '+'
        : '-'}${c.space_used_size}`
  ).join('\n')
}

const detect = (diffs, { minmem }) =>
  filter(
    map(diffs, d => omitBy(d, k => k <= 0)),
    d =>
      Object.keys(d).length > 1 &&
      d.space_name !== 'code_space' &&
      d.space_used_size > minmem
  )
const mit = (optsOrF, fOrNothing) => {
  let opts = { diffReporter, iters: 200, minmem: 10 * 1000000 }
  let f = optsOrF
  if (fOrNothing) {
    opts = Object.assign({}, opts, optsOrF)
    f = fOrNothing
  }

  // warmup
  times(100, f)

  global.gc()
  const before = v8.getHeapSpaceStatistics()
  const samples = times(opts.iters, i => {
    for (var index = 0; index < i; index++) {
      f()
    }
    global.gc()
    const after = v8.getHeapSpaceStatistics()
    return heapdiff(before, after)
  })
  const diffBetweenSamples = zipWith(samples, tail(samples), heapdiff)

  const diff = reduce(drop(diffBetweenSamples, 3), (acc, s) =>
    zipWith(acc, s, (a, b) =>
      mapValues(a, (v, k) => (isString(v) ? v : v + (b[k] || 0)))
    )
  )
  const detected = detect(diff, { minmem: opts.minmem })
  return {
    text: diffReporter(detected),
    detected,
    diff
  }
}
describe('foobanzle', () => {
  it('with functions', async () => {
    const res = await foobanzle([1, 2, 3])
    expect({ res }).toMatchSnapshot()
  })
  it('passes alloc', () => {
    const res = mit(() => {
      const arr = []
      arr.push('foo')
    })
    console.log(res)
    expect(res.detected).toEqual([])
  })
})
