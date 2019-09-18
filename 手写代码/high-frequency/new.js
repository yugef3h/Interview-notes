// https://github.com/mqyqingfeng/Blog/issues/13
function n (ctor, ...args) {
  if (typeof ctor !== 'function') throw '!'
  let obj = Object.create(ctor.prototype)
  let res = ctor.apply(obj, args) // 本质上就是执行函数获取返回值
  let isObject = typeof res === 'object' && res !== null
  let isFunction = typeof res === 'function'
  return isObject || isFunction ? res : obj  // 处理一个返回值
}

function Otaku (name, age) {
  this.strength = 60;
  this.age = age;

  return 'handsome boy';
}

var person = new Otaku('Kevin', '18');

console.log(person.name) // undefined
console.log(person.habit) // undefined
console.log(person.strength) // 60
console.log(person.age) // 18

// res = ctor.apply(obj, args) return res