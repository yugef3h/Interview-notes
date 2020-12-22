function myInstanceof(left, right) {
  // 排除 null
  if (typeof left !== 'object' || left === null) return false
  let proto = Object.getPrototypeOf(left)
  while(true) {
    // 原型链尽头
    if (proto === null) return false
    if (proto === right.prototype) return true
    proto = Object.getPrototypeOf(proto)
  }
}
console.log(myInstanceof([], Array))
console.log(myInstanceof(new String("111"), String)) //true