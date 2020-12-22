const Observer = data => {
  for (let key in data) {
    defineReactive(data, key)
  }
}

const defineReactive = function(obj, key) {
  // 局部变量 dep，用于 get set 内部调用
  const dep = new Dep()
  let val = obj[key]
  Object.defineProperty(obj, key, {
    // 设置当前描述属性为可被循环
    enumerable: true,
    get() {
      console.log('in get')
      // 调用依赖收集器中 addSub，用于收集当前属性与 Watcher 中的依赖关系
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

const observe = data => new Observer(data)

const Vue = function(options) {
  const self = this
  // 将 data 赋值给 this._data，源码这部分用的 Proxy 所以我们用最简单的方式临时实现
  if (options && typeof options.data === 'function') {
    this._data = options.data.apply(this)
  }
  // 挂载函数
  this.mount = function() {
    new Watcher(self, self.render)
  }
  // 渲染函数
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
  // 这里会首次调用 vm._render，从而触发 text 的 get
  // 从而将当前的 Watcher 与 Dep 关联起来
  this.value = fn()
  Dep.target = null
}

const Dep = function() {
  const self = this
  // 收集目标 bug 修正
  // this.target = null
  Dep.target = null
  // 存储收集器中需要通知的 Watcher
  this.subs = []
  // 当有目标时，绑定 Dep 与 Watcher 的关系
  this.depend = function() {
    // 这里其实可以直接写 self.addSub(Dep.target)
    // 没有这么写是因为想还原源码的过程
    if (Dep.target) Dep.target.addDep(self)
  }
  // 为当前收集器添加 Watcher
  this.addSub = function(watcher) {
    self.subs.push(watcher)
  }
  // 通知收集器中所有 Watcher，调用其 update 方法
  this.notify = function() {
    for (let i = 0; i < self.subs.length; i += 1) {
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