// ES5
function Parent() {
  this.type = 'parent'
}
Parent.prototype.makeMoney = function() {
  console.log('+ 陪伴成长')
}
Parent.morningJog = function() {
  console.log('晨跑中……')
}
function Child() {
  Parent.call(this)
  this.name = 'yuql'
}
Child.prototype = Object.create(Parent.prototype)
Child.prototype.constructor = Child
Object.setPrototypeOf(Child, Parent) // 继承父类的静态方法/属性。

// 对象的 hasOwnProperty() 来检查对象自身中是否含有该属性
// 使用 in 检查对象中是否含有某个属性时，如果对象中没有但是原型链中有，也会返回 true
// ES6  extends





// Object.create
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
