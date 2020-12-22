class Subject {
  constructor() {
      this.observers = [] // 观察者队列
  }
  add(observer) { // 没有事件通道
      this.observers.push(observer) // 必须将自己 observer 添加到观察者队列
      this.observers = [...new Set(this.observers)]
  }
  notify(...args) { // 亲自通知观察者
      this.observers.forEach(observer => observer.update(...args))
  }
  remove(observer) {
      let observers = this.observers
    for (let i=0, len=observers.length; i<len; i++) {
          if (observers[i] === observer) observers.splice(i, 1)
      }
  }
}

class Observer {
  update(...args) {
    console.log(...args)
  }
}

let observer_1 = new Observer() // 创建观察者1
let observer_2 = new Observer()
let sub = new Subject() // 创建目标对象
sub.add(observer_1) // 添加观察者1
sub.add(observer_2)
sub.notify('I changed !')