// bad
for (var k = 0; k < 10; k++) {
  var t = function (a) {
    // 创建了10次  函数对象。
    console.log(a)
  }
  t(k)
}

// good
function t(a) {
  console.log(a)
}
for (var k = 0; k < 10; k++) {
  t(k)
}
t = null

// or

