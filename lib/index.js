'use strict';

var execa = require('execa');

var _require = require('lodash'),
    filter = _require.filter,
    map = _require.map,
    drop = _require.drop,
    last = _require.last,
    first = _require.first;

var _require2 = require('moving-averages'),
    ema = _require2.ema;

var path = require('path');
var profile = function profile(node) {
  return function (file) {
    var cwd = process.cwd();
    return execa.shell(node + ' --gc_global --trace_gc --expose-gc ' + path.join(cwd, file)).then(function (res) {
      var text = res.stdout;

      var samples = drop(filter(map(text.split('\n'), function (l) {
        var m = l.match(/.* -> (\d+\.\d+) .* MB,.*/);
        return m && m.length > 1 ? parseFloat(m[1]) : null;
      })), 10);
      var window = samples.length * 0.1;
      var avgs = ema(samples, window);

      var all = last(avgs) - first(avgs);
      return all;
    });
  };
};
var iterate = function iterate(f) {
  var times = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1000;

  for (var index = 0; index < times; index++) {
    f();
    global.gc();
  }
};

module.exports = { profile: profile, iterate: iterate };