​		继续看看第二个规范化函数：normalizeInject：

```js
/**
 * Normalize all injections into Object-based format
 */
function normalizeInject (options: Object, vm: ?Component) {
  const inject = options.inject
  if (!inject) return
  const normalized = options.inject = {}
  if (Array.isArray(inject)) {
    for (let i = 0; i < inject.length; i++) {
      normalized[inject[i]] = { from: inject[i] }
    }
  } else if (isPlainObject(inject)) {
    for (const key in inject) {
      const val = inject[key]
      normalized[key] = isPlainObject(val)
        ? extend({ from: key }, val)
        : { from: val }
    }
  } else if (process.env.NODE_ENV !== 'production') {
    warn(
      `Invalid value for option "inject": expected an Array or an Object, ` +
      `but got ${toRawType(inject)}.`,
      vm
    )
  }
}
```

​		从注释得知：inject将规范成对象类型。

​		首先是这三句：

```js
const inject = options.inject
if (!inject) return
const normalized = options.inject = {}
```

​		其作用是将options中的inject缓存到了inject这个变量上，然后判断options上是否存在inject，如果不存在就退出函数的执行，第三局将options.inject重写为一个空的JS对象，并且将normalized变量指向这个空的JS对象，

​		接着是判断分支语句，判断inject选项是否为数组和纯对象，当inject为数组时：

```js
if (Array.isArray(inject)) {
  for (let i = 0; i < inject.length; i++) {
    normalized[inject[i]] = { from: inject[i] }
  }
}
```

​		通过for循环遍历，将每个元素的值作为key，然后将{form:inject[i]}作为值，比如你的inject是这样写的：

```js
inject:['data1', 'data2']
```

​		将被规范化为：

```js
inject:{
  'data1': { from: 'data1' },
  'data2': { from: 'data2' }
}
```

___

​		当inject不是数组类型而是一个纯对象时：

```js
if (Array.isArray(inject)) {
  ...
} else if (isPlainObject(inject)) {
  for (const key in inject) {
    const val = inject[key]
    normalized[key] = isPlainObject(val)
      ? extend({ from: key }, val)
      : { from: val }
  }
} else if (process.env.NODE_ENV !== 'production') {
  ...
}
```

​		使用for循环遍历inject对象，每次循环中，将key作为normalized的key，其值还需要判断是否为纯对象，如果是纯对象的话还需要通过extend方法与{from:key}进行混合，否则直接使用val作为form的值。

​		比如inject是这样写的：

```js
let data1 = 'data1'

// 这里为简写，这应该写在Vue的选项中
inject: {
  data1,
  d2: 'data2',
  data3: { someProperty: 'someValue' }
}
```

​		经过规范化后就变成了：

```js
inject: {
  'data1': { from: 'data1' },
  'd2': { from: 'data2' },
  'data3': { from: 'data3', someProperty: 'someValue' }
}
```

​		如果既不是数组也不是对象则报相应警告。