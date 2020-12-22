​		分析完initLifecycle函数，那么看看下一个函数initEvents:

```js
export function initEvents (vm: Component) {
  vm._events = Object.create(null)
  vm._hasHookEvent = false
  // init parent attached events
  const listeners = vm.$options._parentListeners
  if (listeners) {
    updateComponentListeners(vm, listeners)
  }
}
```

​		首先在vm实例上添加两个属性_events和 _hasHookEvent，其中 _events被初始化为null， _hasHookEvent为false, 然后赋值 vm.$options._parentListeners给listeners常量。至于_parentListeners从何而来暂时不深入讨论。