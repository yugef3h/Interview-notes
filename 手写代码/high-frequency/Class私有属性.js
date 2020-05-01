// 提案，需要 babel 转译
// class Foo {
//   #a;  // 定义私有属性
//   constructor(a, b) {
//     this.#a = a;
//     this.b = b
//   }
// }

// 可以直接看第三种，也是 TS private 经过 babel 编译的版本，使用 WeakMap
// 第一种使用闭包，缺点：实例之间共享私有变量
const MyClass = (function() {
  let _x
  class PrivClass {
    constructor(x) {
      _x = x
    }
    getX() {
      return _x
    }
  }
  return PrivClass
})()
let myClass = new MyClass(3)
console.log(myClass._x) // undefined
console.log(myClass.getX()) // 3
let otherClass = new MyClass(4)
console.log(myClass.getX()) // 4 这里表明共享了 _x

// 第二种使用 Symbol
console.log('----------')
const SymClass = (function(){
  const _x = Symbol('x')
  class SymbolClass {
    constructor(x) {
      // this._x = x 错误写法。
      this[_x] = x
    }
    getX() {
      return this[_x]
    }
  }
  return SymbolClass
})()
let myPriv = new SymClass(4)
console.log(myPriv._x) // undefined
console.log(myPriv.getX()) // 4
let otherPriv = new SymClass(5)
console.log(myPriv.getX()) // 还是 4
console.log(Object.getOwnPropertySymbols(myPriv)[0]) // 拿到 Symbol 属性
console.log(myPriv[Object.getOwnPropertySymbols(myPriv)[0]]); // 4
// Sysmol 要配合 import/export 模板语法。比如 A.js 里面你定义了 class A和 Symbol，对外只暴露 class A。然后在别的 js 文件引入 class A 实例化，拿不到 Symbol 的值，而且无法通过 '.' 去访问变量名（Symbol 唯一，不暴露外界拿不到）。这样才是私有。

// 第三种：闭包 + WeakMap
console.log('---------')
const ClassOuter = (function() {
  const _x = new WeakMap()
  class ClassInner {
    constructor(x) {
      _x.set(this, x)
    }
    getX() {
      return _x.get(this)
    }
  }
  return ClassInner
})()
let myclass = new ClassOuter(5)
console.log(myclass.x) // undefined
console.log(myclass.getX()) // 5
