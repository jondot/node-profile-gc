'use strict';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 100 * 1000;

var _require = require('../index'),
    profile = _require.profile;

var nodeProfile = profile('node');

describe('mem test', function () {
  it('should not leak', function () {
    return nodeProfile('src/__bench__/safe.mem.js').then(function (usage) {
      expect(usage).toBeLessThan(1);
    });
  });
  it('should leak', function () {
    return nodeProfile('src/__bench__/leaky.mem.js').then(function (usage) {
      expect(usage).toBeGreaterThan(1);
    });
  });
});