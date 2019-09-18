Array.prototype.map = function(callbackFn, thisArg) {
  if (this === null || this === undefined) throw new TypeError('cannot read property')
  if (Object.prototype.toString.call(callbackFn) != '[object Function]') throw new TypeError('is not a function')
  let O = Object(this)
  let T = thisArg
  let len = O.length >>> 0
  let A = new Array(len)
  for (let k=0; k<len; k++) {
    if (k in O) {
      let KValue = O[k]
      let mappedValue = callbackFn.call(T, KValue, k, O)
      A[k] = mappedValue
    }
  }
  return A
}