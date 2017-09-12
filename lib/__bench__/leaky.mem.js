'use strict';

var _require = require('../index'),
    iterate = _require.iterate;

var arr = [];
function a() {
  arr.push('hello' + Math.random());
}
iterate(a, 20000);