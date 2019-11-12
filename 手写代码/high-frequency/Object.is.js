// 解决的问题：
// +0 === -0  // true
// NaN === NaN // false

const is = (x, y) => {
  if (x === y) {
    // +0 和 -0 应该不相等
    return x !== 0 || y !== 0 || 1/x === 1/y
  } else {
    return x !== x && y !== y
  }
}
