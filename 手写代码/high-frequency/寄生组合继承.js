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






function create(proto) {
  function F() {}
  F.prototype = proto;
  return new F();
}

// Parent
function Parent(name) {
  this.name = name
}

Parent.prototype.sayName = function () {
  console.log(this.name)
};

// Child
function Child(age, name) {
  Parent.call(this, name)
  this.age = age
}
Child.prototype = create(Parent.prototype)
Child.prototype.constructor = Child

Child.prototype.sayAge = function () {
  console.log(this.age)
}

// 测试
const child = new Child(18, 'Jack')
child.sayName()
child.sayAge()
