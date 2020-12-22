Array.prototype.reduce = function(callbackfn, initialvalue) {
  if (this === null || this === undefined) throw new TypeError("Cannot read property 'reduce' of null or undefined")
  if (Object.prototype.toString.call(callbackfn) !== '[object Function]') throw new TypeError(callbackfn + ' is not a function')
  let O = Object(this)
  let len = O.length >>> 0
  let k = 0
  let cumulative = initialvalue
  if (cumulative === undefined) {
    for (; k<len; k++) {
      if (k in O) {
        cumulative = O[k]
        k++
        break
      }
    }
  }
  if (k === len && cumulative === undefined) throw new Error('Each element of the array is empty')
  for (; k<len; k++) {
    if (k in O) {
      // 核心，其中 call(undefined, ...) 表示直接调用 callbackfn，不需要回函的 this
      cumulative = callbackfn.call(undefined, cumulative, O[k], k, O)
    }
  }
  return cumulative
}

console.log([1, 2, 3].reduce(function(a, b) { return a + b }, 0))