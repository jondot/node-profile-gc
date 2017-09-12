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

const mit = (optsOrF, fOrNothing) => {
  let opts = { iters: 200, minmem: 10 * 1000000 }
  let f = optsOrF
  if (fOrNothing) {
    opts = Object.assign({}, opts, optsOrF)
    f = fOrNothing
  }

  // warmup
  times(100, f)

  let acc = 0
  for (var i = 0; i < opts.iters; i++) {
    global.gc()
    const before = v8.getHeapStatistics().used_heap_size
    for (var index = 0; index < i; index++) {
      f()
    }
    global.gc()
    const after = v8.getHeapStatistics().used_heap_size
    if (i > 3) {
      acc += after - before
    }
  }
  return {
    acc
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
    expect(res).toEqual([])
  })
})
