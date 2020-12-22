​		我们知道 `Vue` 数据响应系统的原理的核心是通过 `Object.defineProperty` 函数将数据对象的属性转换为访问器属性，从而使得我们能够拦截到属性的读取和设置，但正如官方文档中介绍的那样，`Vue` 是没有能力拦截到为一个对象(或数组)添加属性(或元素)的，而 `Vue.set` 和 `Vue.delete` 就是为了解决这个问题而诞生的。同时为了方便使用， `Vue` 还在实例对象上定义了 `$set` 和 `$delete` 方法，实际上 `$set` 和 `$delete` 方法仅仅是 `Vue.set` 和 `Vue.delete` 的别名。查看这几个方法的定义处可以发现：

```js
  Vue.prototype.$set = set  
  Vue.prototype.$delete = del
  Vue.set = set  
  Vue.delete = del
```

​		全局API中的set和delete和实例方法$set和$delete都是出自`src/core/observer/index.js` 文件中定义的set和del方法。下面就看看这两个方法的具体实现：

___

### Vue.set/$set

```js
export function set (target: Array<any> | Object, key: any, val: any): any {
  // 省略...
}
```

​			`set` 函数接收三个参数，第一个参数 `target` 是将要被添加属性的对象，第二个参数 `key` 以及第三个参数 `val` 分别是要添加属性的键名和值。

下面我们一点点来看 `set` 函数的代码，首先是一个 `if` 语句块：

```js
if (process.env.NODE_ENV !== 'production' &&
  (isUndef(target) || isPrimitive(target))
) {
  warn(`Cannot set reactive property on undefined, null, or primitive value: ${(target: any)}`)
}
```

​		`isUndef` 函数用来判断一个值是否是 `undefined` 或 `null`，如果是则返回 `true`，`isPrimitive` 函数用来判断一个值是否是原始类型值，如果是则返回 true。 所以如上代码 `if` 语句块的作用是：**如果 `set` 函数的第一个参数是 `undefined` 或 `null` 或者是原始类型值，那么在非生产环境下会打印警告信息**。这么做是合理的，因为理论上只能为对象(或数组)添加属性(或元素)。

​		isUndef：

```js
// These helpers produce better VM code in JS engines due to their
// explicitness and function inlining.
export function isUndef (v: any): boolean %checks {
  return v === undefined || v === null
}
```

​		原始值类型是这么判断的：

```js
export function isPrimitive (value: any): boolean %checks {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    // $flow-disable-line
    typeof value === 'symbol' ||
    typeof value === 'boolean'
  )
}
```

​		紧接着又是一段 `if` 语句块，如下：

```js
if (Array.isArray(target) && isValidArrayIndex(key)) {  target.length = Math.max(target.length, key)
  target.splice(key, 1, val)
  return val
}
```

​		这段代码对 `target` 和 `key` 这两个参数做了校验，如果 `target` 是一个数组，并且 `key` 是一个有效的数组索引，那么就会执行 `if` 语句块的内容。在校验 `key` 是否是有效的数组索引时使用了 `isValidArrayIndex` 函数。

​		我们看看 `$set` 函数是如何实现的，注意如下高亮代码：

```js
if (Array.isArray(target) && isValidArrayIndex(key)) {
  target.length = Math.max(target.length, key)  target.splice(key, 1, val)  return val}
```

​		原理其实很简单，我们知道数组的 `splice` 变异方法能够完成数组元素的删除、添加、替换等操作。而 `target.splice(key, 1, val)` 就利用了替换元素的能力，将指定位置元素的值替换为新值，同时由于 `splice` 方法本身是能够触发响应的，所以一切看起来如此简单。

​		另外注意在调用 `target.splice` 函数之前，需要修改数组的长度：

```js
target.length = Math.max(target.length, key)
```

​		将数组的长度修改为 `target.length` 和 `key` 中的较大者，否则如果当要设置的元素的索引大于数组长度时 `splice` 无效。

​		再往下依然是一个 `if` 语句块，如下：

```js
if (key in target && !(key in Object.prototype)) {
  target[key] = val
  return val
}
```

​		如果 `target` 不是一个数组，那么必然就是纯对象了，当给一个纯对象设置属性的时候，假设该属性已经在对象上有定义了，那么只需要直接设置该属性的值即可，这将自动触发响应，因为已存在的属性是响应式的。但这里要注意的是 `if` 语句的两个条件：

- `key in target`
- `!(key in Object.prototype)`

​		这两个条件保证了 `key` 在 `target` 对象上，或在 `target` 的原型链上，同时必须不能在 `Object.prototype` 上。

​		我们继续看代码，接下来是这样一段代码，这是 `set` 函数剩余的全部代码，如下：

```js
const ob = (target: any).__ob__
if (target._isVue || (ob && ob.vmCount)) {
  process.env.NODE_ENV !== 'production' && warn(
    'Avoid adding reactive properties to a Vue instance or its root $data ' +
    'at runtime - declare it upfront in the data option.'
  )
  return val
}
if (!ob) {
  target[key] = val
  return val
}
	defineReactive(ob.value, key, val)
    ob.dep.notify()
return val
```

​		如果代码运行到了这里，那说明正在给对象添加一个全新的属性，注意上面代码中定义了 `ob` 常量，它是数据对象 `__ob__` 属性的引用。倒数第三行的代码使用 `defineReactive` 函数设置属性值，这是为了保证新添加的属性是响应式的。倒数第二行的代码调用了 `__ob__.dep.notify()` 从而触发响应。这就是添加全新属性触发响应的原理。

​		另外值得注意的是上面第一个if判断的第二个条件：(ob && ob.vmCount)。我们知道 `ob` 就是 `target.__ob__` 那么 `ob.vmCount` 是什么呢？为了搞清这个问题，我们回到 `observe` 工厂函数中，如下高亮代码：

```js
export function observe (value: any, asRootData: ?boolean): Observer | void {
  // 省略...
  if (asRootData && ob) {    ob.vmCount++  }  return ob
}
```

​		`observe` 函数接收两个参数，第二个参数指示着被观测的数据对象是否是根数据对象，什么叫根数据对象呢？那就看 `asRootData` 什么时候为 `true` 即可，我们找到 `initData` 函数中，他在 `src/core/instance/state.js` 文件中，如下：

```js
function initData (vm: Component) {
  let data = vm.$options.data
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {}
  
  // 省略...

  // observe data
  observe(data, true /* asRootData */)}
```

​		可以看到在调用 `observe` 观测 `data` 对象的时候 `asRootData` 参数为 `true`。而在后续的递归观测中调用 `observe` 的时候省略了 `asRootData` 参数。所以所谓的根数据对象就是 `data` 对象。这时候我们再来看如下代码：

```js
export function observe (value: any, asRootData: ?boolean): Observer | void {
  // 省略...
  if (asRootData && ob) {    ob.vmCount++  }  return ob
}
```

​		可以发现，根数据对象将拥有一个特质，即 `target.__ob__.vmCount > 0`，这样条件 `(ob && ob.vmCount)` 是成立的，也就是说：**当使用 `Vue.set/$set` 函数为根数据对象添加属性时，是不被允许的**。

那么为什么不允许在根数据对象上添加属性呢？因为这样做是永远触发不了依赖的。原因就是根数据对象的 `Observer` 实例收集不到依赖(观察者)，如下：

```js
const data = {
  obj: {
    a: 1
    __ob__ // ob2  },
  __ob__ // ob1}
new Vue({
  data
})
```

​		如上代码所示，`ob1` 就是属于根数据的 `Observer` 实例对象，如果想要在根数据上使用 `Vue.set/$set` 并触发响应：

```js
Vue.set(data, 'someProperty', 'someVal')
```

​		那么 `data` 字段必须是响应式数据才行，这样当 `data` 字段被依赖时，才能够收集依赖(观察者)到两个“筐”中(`data属性自身的 dep`以及`data.__ob__`)。这样在 `Vue.set/$set` 函数中才有机会触发根数据的响应。但 `data` 本身并不是响应的，这就是问题所在。

____

### Vue.delete/$delete

找到 `del` 函数：

```js
export function del (target: Array<any> | Object, key: any) {
  // 省略...
}
```

​		`del` 函数接收两个参数，分别是将要被删除属性的目标对象 `target` 以及要删除属性的键名 `key`，与 `set` 函数相同，在函数体的开头是如下 `if` 语句块：

```js
if (process.env.NODE_ENV !== 'production' &&
  (isUndef(target) || isPrimitive(target))
) {
  warn(`Cannot delete reactive property on undefined, null, or primitive value: ${(target: any)}`)
}
```

​		检测 `target` 是否是 `undefined` 或 `null` 或者是原始类型值，如果是的话那么在非生产环境下会打印警告信息。

​		接着是如下这段 `if` 语句块：

```js
if (Array.isArray(target) && isValidArrayIndex(key)) {
  target.splice(key, 1)
  return
}
```

​		很显然，如果我们使用 `Vue.delete/$delete` 去删除一个数组的索引，如上这段代码将被执行，当然了前提是参数 `key` 需要是一个有效的数组索引。与为数组添加元素类似，移除数组元素同样使用了数组的 `splice` 方法，大家知道这样是能够触发响应的。

​		再往下是如下这段 `if` 语句块：

```js
const ob = (target: any).__ob__
if (target._isVue || (ob && ob.vmCount)) {
  process.env.NODE_ENV !== 'production' && warn(
    'Avoid deleting properties on a Vue instance or its root $data ' +
    '- just set it to null.'
  )
  return
}
```

​		与不能使用 `Vue.set/$set` 函数为根数据或 `Vue` 实例对象添加属性一样，同样不能使用 `Vue.delete/$delete` 删除 `Vue` 实例对象或根数据的属性。不允许删除 `Vue` 实例对象的属性，是出于安全因素的考虑。而不允许删除根数据对象的属性，是因为这样做也是触发不了响应的，关于触发不了响应的原因，我们在讲解 `Vue.set/$set` 时已经分析过了。

​		接下来是 `Vue.delete/$delete` 函数的最后一段代码，如下：

```js
if (!hasOwn(target, key)) {
  return
}
delete target[key]
if (!ob) {
  return
}
ob.dep.notify()
```

​		首先使用 `hasOwn` 函数检测 `key` 是否是 `target` 对象自身拥有的属性，如果不是那么直接返回(`return`)。很好理解，如果你将要删除的属性原本就不在该对象上，那么自然什么都不需要做。

​		如果 `key` 存在于 `target` 对象上，那么代码将继续运行，此时将使用 `delete` 语句从 `target` 上删除属性 `key`。最后判断 `ob` 对象是否存在，如果不存在说明 `target` 对象原本就不是响应的，所以直接返回(`return`)即可。如果 `ob` 对象存在，说明 `target` 对象是响应的，需要触发响应才行，即执行 `ob.dep.notify()`。