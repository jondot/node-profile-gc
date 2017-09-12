jasmine.DEFAULT_TIMEOUT_INTERVAL = 100 * 1000
const { profile } = require('../index')
const nodeProfile = profile('node')

describe('mem test', () => {
  it('should not leak', () =>
    nodeProfile('src/__bench__/safe.mem.js').then(usage => {
      expect(usage).toBeLessThan(1)
    }))
  it('should leak', () =>
    nodeProfile('src/__bench__/leaky.mem.js').then(usage => {
      expect(usage).toBeGreaterThan(1)
    }))
})
