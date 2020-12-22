​		在_init方法中的这段代码：

```js
callHook(vm, 'beforeCreate')
initInjections(vm) // resolve injections before data/props
initState(vm)
initProvide(vm) // resolve provide after data/props
callHook(vm, 'created')
```

​		可以看到在initState之前先执行了initInjections函数，也就是说inject选项要更早被初始化，但由于初始化inject选项的时候涉及到了defineReactive函数并且调用了toggleObserving函数操作了用于控制是否应该转换为响应式属性的状态标识observerState.shouldConvert，这些都是Vue响应系统相关的东西，所以这里先不分析injection的初始化了，那么接下来我们可以分析initState：

```js
export function initState (vm: Component) {
  vm._watchers = []
  const opts = vm.$options
  if (opts.props) initProps(vm, opts.props)
  if (opts.methods) initMethods(vm, opts.methods)
  if (opts.data) {
    initData(vm)
  } else {
    observe(vm._data = {}, true /* asRootData */)
  }
  if (opts.computed) initComputed(vm, opts.computed)
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch)
  }
}
```

​		首先Vue实例对象添加了一个空数组属性_watchers，这个属性将用来存储所有该组件实例的watcher对象。然后定义了常量opts,它是vm.$options的引用，接着执行了这两句：

```js
if (opts.props) initProps(vm, opts.props)
if (opts.methods) initMethods(vm, opts.methods)
```

​		很简单，如果opts上存在props则执行initProps方法初始化props选项，methods同理。

​		再往下执行的是这段代码：

```js
if (opts.data) {
  initData(vm)
} else {
  observe(vm._data = {}, true /* asRootData */)
}
```

​		首先判断data选项是否存在，如果存在则调用initData初始化data选项，如果不存在则直接调用observe函数观测一个空对象{}

​		最后执行：

```js
if (opts.computed) initComputed(vm, opts.computed)
if (opts.watch && opts.watch !== nativeWatch) {
  initWatch(vm, opts.watch)
}
```

​		采用同样的方式初始化computed选项，但是对于watch选项仅仅判断是否存在是不够的，因为有些浏览器有自带的原生watch对象比如火狐，所以我们还需要判断这个watch选项是否原生的。所以如果watch选项存在且这个watch不是原生的，就执行initWatch方法去初始化watch选项。

​		通过阅读initState函数，我们可以发现initState其实是很多选项初始化的汇总，包括：props、methods、data、computed、watch等。并且我们注意到props选项的初始化要早于data选项的初始化，那么这个是不是可以使用props选项的初始化去初始化data的数据的原因呢？答案是的。接下来，我们就准备分析最令人激动的数据响应系统，也是Vue初始化中的关键一步!

