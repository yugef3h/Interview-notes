// https://github.com/mqyqingfeng/Blog/issues/13
function n (ctor, ...args) {
  if (typeof ctor !== 'function') throw '!'
  let obj = Object.create(ctor.prototype)
  // 考虑构造函数有返回值的情况
  // function fn() {return {...}}
  let res = ctor.apply(obj, args) // 本质上就是执行函数获取返回值，apply 用来添加新属性
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

function myNew(Func, ...args) {
  const instance = {}
  if (Func.prototype) Object.setPrototypeOf(instance, Func.prototype)

  const res = Func.apply(instance, args)
  if (typeof res === 'function' || (typeof res === 'object' && res !== null)) return res
  return instance
}

// 测试
function Person(name) {
  this.name = name
}
Person.prototype.sayName = function() {
  console.log(`My name is ${this.name}`)
}
const me = myNew(Person, 'Jack')
me.sayName()
console.log(me)
