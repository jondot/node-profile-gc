'use strict';

var _require = require('../index'),
    iterate = _require.iterate;

function a() {
  var arr = [];
  arr.push('hello');
}
iterate(a, 20000);