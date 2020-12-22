		之前分析initState的时候，里面初始化了很多数据相关的选项，比如使用initData方法初始化data选项，那么我们以initData方法为切入点去分析Vue的响应系统，并且因为initData几乎涉及了全部的数据响应相关的内容，分析完initData，以后在分析initProps、initComputed、initWatch等就轻而易举了。

​		在initState中：

```js
if (opts.data) {
  initData(vm)
} else {
  observe(vm._data = {}, true /* asRootData */)
}
```

​		首先判断data选项是否存在，如果存在则调用initData函数去初始化data选项，否则通过observe函数观测一个空对象，并且vm_data指向该空对象。其中observe函数是将data转换成响应式数据的核心入口，另外_data属性我们之前分析过，是由$data代理的。接下来就看看这个initData的具体实现：

```js
function initData (vm: Component) {
  let data = vm.$options.data
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {}
  if (!isPlainObject(data)) {
    data = {}
    process.env.NODE_ENV !== 'production' && warn(
      'data functions should return an object:\n' +
      'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
      vm
    )
  }
  // proxy data on instance
  const keys = Object.keys(data)
  const props = vm.$options.props
  const methods = vm.$options.methods
  let i = keys.length
  while (i--) {
    const key = keys[i]
    if (process.env.NODE_ENV !== 'production') {
      if (methods && hasOwn(methods, key)) {
        warn(
          `Method "${key}" has already been defined as a data property.`,
          vm
        )
      }
    }
    if (props && hasOwn(props, key)) {
      process.env.NODE_ENV !== 'production' && warn(
        `The data property "${key}" is already declared as a prop. ` +
        `Use prop default value instead.`,
        vm
      )
    } else if (!isReserved(key)) {
      proxy(vm, `_data`, key)
    }
  }
  // observe data
  observe(data, true /* asRootData */)
}
```

​		先看第一段：

```js
let data = vm.$options.data
data = vm._data = typeof data === 'function'
  ? getData(data, vm)
  : data || {}
```

​		首先定义data变量指向vm.$options.data的引用。在Vue选项的合并中我们知道了vm.$options.data是一个函数，且执行该函数的结果就是真正的数据。虽然通过mergeOptions方法将data变成了一个函数，但不能保证它一直都是函数类型，因为在执行initState之前还执行了beforeCreate这个生命周期钩子函数，所以我们保不齐开发人员会不会在里面改变$options.data的值，那么在initData中对其类型进行判断就是必要的了。

​		如果$options.data依然是函数类型，则执行getData函数，具体看看getData的具体实现：

```js
export function getData (data: Function, vm: Component): any {
  // #7573 disable dep collection when invoking data getters
  pushTarget()
  try {
    return data.call(vm, vm)
  } catch (e) {
    handleError(e, vm, `data()`)
    return {}
  } finally {
    popTarget()
  }
}
```

​		可以看到，getData函数的作用就是通过调用data函数获取真正的数据对象并返回。另外，开头的pushTarget函数以及最后finally中调用的popTarget函数又有何作用呢？根据注释，这么做是为了防止props数据初始化data数据时收集冗余的依赖，具体细节等到分析Vue如何收集依赖再看。

​		总之，getData就是通过调用data选项从而获取数据对象。

​		回到initData中，调用完getData后返回的真正数据将赋值到Vue实例的_data属性上，同时重写了之前定义的data变量为这个真正的数据。

​		接着是一个if代码块：

```js
if (!isPlainObject(data)) {
  data = {}
  process.env.NODE_ENV !== 'production' && warn(
    'data functions should return an object:\n' +
    'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
    vm
  )
}
```

​		这段代码判断了刚刚得到的data是否是一个纯对象类型的值，如果不是的话将data重置为一个空对象并且报出警告。

​		接下来，通过Object.keys将data中的所有键名组成一个数组赋值到keys常量中，然后遍历keys，去判断methods和props中是否存在相同的键名。如果methods中存在相同的键名则会报处警告：methods中的这个属性已经被data作为属性定义过了，应该换一个函数名字。接着判断props中是否存在该属性名，如果存在会报处警告：这个data属性已经被声明为一个prop属性了，请在prop的该属性中使用默认值的方式来代替这个data属性。另外这里有优先级的关系：**props优先级>methods优先级>data优先级**。因为在initState中是先执行InitProps，再执行initMethods，最后再执行initData方法，并且每个方法中会判断每个属性是否已在之前初始化的选项中声明过，如果声明过则会报错，这些逻辑保证了Vue初始化的时候各个选项的属性不会被其他选项的属性所覆盖，如果发生覆盖的时候会报出警告。

​		接着，如果props中也不存在这个键名，则通过isReserved方法判断这个键名是否是一个保留键名，那么isReserved方法判断了这个键名是否以$或_开头来决定它是否是保留的，所以Vue是不会代理那些键名为$或 _开头的字段的，这么做主要是为了避免这些属性与Vue自身的属性和方法相冲突。

​		如果不是保留键名，此时则执行

```js
proxy(vm, `_data`, key)
```

​		实现实例对象的代理访问。那么这个proxy都做了什么事情呢，我们看看它的具体实现：

```js
export function proxy (target: Object, sourceKey: string, key: string) {
  sharedPropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key]
  }
  sharedPropertyDefinition.set = function proxySetter (val) {
    this[sourceKey][key] = val
  }
  Object.defineProperty(target, key, sharedPropertyDefinition)
}
```

​		其中sharedPropertyDefinition是这么定义的：

```js
const sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
}
```

​		noop表示一个空函数。所以proxy做的事情就是通过Object.defineProperty函数再实例对象vm上定义与data数据字段同名的访问器属性，并且这些属性代理的值是vm._data上对应属性的值。举个例子：

```js
const ins = new Vue ({
  data: {
    a: 1
  }
})
```

​		那么当我们访问ins.a时实际上访问的是ins._data.a，而ins. _data才是真正的数据对象。

​		经过上面的处理，令人激动的最后的一句代码：

```
observe(data, true /* asRootData */)
```

​		通过调用observe方法将data数据对象转换成响应式的，可以说是这句代码才是响应系统的开始！在看这个observe方法之前我们先总结一下initData所作的事情：

* 根据vm.$options.data获取到真正的数据并赋值到vm._data上
* 检验得到的数据是否是一个纯对象
* 检查数据对象data上的键是否与props对象上的键冲突
* 检查methods对象上的键是否与data对象上的键冲突
* 在Vue实例上添加代理访问数据对象的同名属性
* 最后调用observe函数变成响应式的数据