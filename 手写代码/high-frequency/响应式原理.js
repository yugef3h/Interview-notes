// vue reactive.js 版更佳
const Observer = function (data) {
  // for get/set
  for (let key in data) {
    defineReactive(data, key)
  }
}

const defineReactive = function (obj, key) {
  // 局部变量 dep，用于 get set 内部调用
  const dep = new Dep()
  let val = obj[key]
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get() {
      console.log('in get')
      // 调用依赖收集器的 addSub，用于收集当前属性与 Watcher 中的依赖关系
      dep.depend()
      return val
    },
    set(newVal) {
      if (newVal === val) return;
      val = newVal
      // 当值发生变更时，通知依赖收集器，更新每个需要更新的 Watcher
      // 这里每个需要更新通过什么断定？dep.subs
      dep.notify()
    }
  })
}

const observe = function(data) {
  return new Observer(data)
}

const Vue = function (options) {
  const self = this
  // 将 data 赋值给 this._data
  if (options && typeof options.data === 'function') {
    this._data = options.data.apply(this)
  }
  // 挂载函数：mount 页面渲染完毕，在节点上绑定更新函数，添加监听数据的订阅者 watcher
  this.mount = function() {
    new Watcher(self, self.render)
  }
  // 渲染函数，里面决定了只有页面渲染才会 get 的值，当前只有 text
  // 没在 render 里的数据依旧能够 set 改变值，但不会触发 notify，因为没有被 get Watcher，总要是为了避免毫无意义的渲染。
  this.render = function() {
    with(self) {
      _data.text
    }
  }
  // 监听 this._data
  observe(this._data)
}

const Watcher = function(vm, fn) {
  const self = this
  this.vm = vm
  // 将当前 Dep.target 指向自己
  Dep.target = this
  // 向 Dep 方法添加当前 Watcher
  this.addDep = function(dep) {
    dep.addSub(self)
  }
  // 更新方法，用于触发 vm._render
  this.update = function() {
    console.log('in watcher update')
    fn()
  }
  // 首次调用 vm._render，从而触发 text 的 get
  // 从而将当前的 Watcher 与 Dep 关联起来
  this.value = fn()
  // 这里清空了 Dep.target，为了防止 notify 触发时，不停地绑定 Watcher 与 Dep
  Dep.target = null
}

const Dep = function() {
  const self = this
  // this.target = null
  // 收集目标 bug 修正
  Dep.target = null
  // 存储收集器中需要通知的 Watcher
  this.subs = []
  // 当有目标时，绑定 Dep 与 Watcher 的关系
  this.depend = function() {
    if (Dep.target) { // 挂在 Dep 函数下的一个属性 target，用于挂在 watcher
      // 这里其实可以直接写成 self.addSub(Dep.target)
      // 没有这么写因为想还原源码的过程
      Dep.target.addDep(self)
    }
  }
  // 为当前收集器添加 Watcher
  this.addSub = function(watcher) {
    self.subs.push(watcher)
  }
  // 通知收集器中的所有 Watcher，调用其 update 方法
  this.notify = function() {
    console.log(self.subs.length)
    for (let i=0; i<self.subs.length; i+=1) {
      self.subs[i].update()
    }
  }
}

const vue = new Vue({
  data() {
    return {
      text: 'hello world'
    }
  }
})

vue.mount() // in get
vue._data.text = '123'

// in watcher updata
// in get