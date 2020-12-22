class Group {
  constructor() {
    this.message = '暂无通知'
    this.parents = []
  }
  getMessage() {
    return this.message
  }
  setMessage(message) {
    this.message = message
    this.notifyAllObservers()
  }
  notifyAllObservers() {
    this.parents.forEach((parent) => {
      parent.update()
    })
  }
  attach(parent) {
    this.parents.push(parent)
  }
}
class Parent {
  constructor(name, group) {
    this.name = name
    this.group = group
    this.group.attach(this)
  }
  update() {
    console.log(`${this.name} 收到通知: ${this.group.getMessage()}`)
  }
}
let group = new Group()
let t1 = new Parent('li', group)
let t2 = new Parent('zh', group)
let t3 = new Parent('wa', group)

group.setMessage('开会1')
group.setMessage('开会2')