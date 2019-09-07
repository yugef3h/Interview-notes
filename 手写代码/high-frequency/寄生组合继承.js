// ES5
function Parent() {
  this.type = 'parent'
}
function Child() {
  Parent.call(this)
  this.name = 'yuql'
}
Child.prototype = Object.create(Parent.prototype)
Child.prototype.constructor = Child
Object.setPrototypeOf(Child, Parent) // 继承父类的静态方法。

// ES6  extends