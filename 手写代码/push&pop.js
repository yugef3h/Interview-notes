Array.prototype.push = function(...items) {
  let O = Object(this)
  let len = this.length >>> 0
  let argCount = items.length >>> 0
  if (len + argCount > 2 ** 53 - 1) throw new TypeError('!')
  for (let i=0; i< argCount; i++) {
    O[len + i] = items[i]
  }
  let newLength = len + argCount
  O.length = newLength
  return newLength
}

Array.prototype.pop = function() {
  let O = Object(this)
  let len = this.length >>> 0
  if (len === 0) return O.length = 0, undefined
  len --
  let value = O[len]
  delete O[len]
  O.length = len
  return value
}