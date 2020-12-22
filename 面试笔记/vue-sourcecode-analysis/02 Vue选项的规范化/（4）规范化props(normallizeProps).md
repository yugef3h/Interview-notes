​		接下来的三行代码：

```
normalizeProps(child, vm)
normalizeInject(child, vm)
normalizeDirectives(child)
```

​		这三个方法是用来规范化选项的。以props为例，在Vue中使用props的时候有两种写法，一种是字符串数组，一种是使用对象：

```js
const ChildComponent = {
  props: ['someData']
}
```

```js
const ChildComponent = {
  props: {
    someData: {
      type: Number,
      default: 0
    }
  }
}
```

​		除了props，在Vue中还有很多具有多种使用方法的选项，虽然给开发者带来了充分的灵活性，但在Vue需要对这些选项进行处理，将不同的写法规范成同一种形式，这样就可以在选项合并时统一处理而不用再进行繁琐的类型判断等。

​		首先看看normalizeProps函数的内部实现：

```
/**
 * Ensure all props option syntax are normalized into the
 * Object-based format.
 */
function normalizeProps (options: Object, vm: ?Component) {
  const props = options.props
  if (!props) return
  const res = {}
  let i, val, name
  if (Array.isArray(props)) {
    i = props.length
    while (i--) {
      val = props[i]
      if (typeof val === 'string') {
        name = camelize(val)
        res[name] = { type: null }
      } else if (process.env.NODE_ENV !== 'production') {
        warn('props must be strings when using array syntax.')
      }
    }
  } else if (isPlainObject(props)) {
    for (const key in props) {
      val = props[key]
      name = camelize(key)
      res[name] = isPlainObject(val)
        ? val
        : { type: val }
    }
  } else if (process.env.NODE_ENV !== 'production') {
    warn(
      `Invalid value for option "props": expected an Array or an Object, ` +
      `but got ${toRawType(props)}.`,
      vm
    )
  }
  options.props = res
}
```

​		根据注释可以知道最终props将规范成对象的形式，比如：

```js
props: ["someData"]
```

​		经过normalizeProps函数会变成:

```js
props: {
  someData:{
    type: null
  }
}
```

​	

​		如果你的props是对象如下：

```js
props: {
  someData1: Number,
  someData2: {
    type: String,
    default: ''
  }
}
```

​		经过normalizeProps函数会变成:

```js
props: {
  someData1: {
    type: Number
  },
  someData2: {
    type: String,
    default: ''
  }
}
```

____

首先：

```js
const props = options.props
if (!props) return
```

如果options没有props这个属性就不会往下执行了。



然后是：

```
const res = {}
let i, val, name
```

其中res是最终覆盖到options.props上的值。

然后开始判断分支，判断props是数组还是对象并执行相应的操作。

首先是字符串数组的情况：

```js
if (Array.isArray(props)) {
  i = props.length
  while (i--) {
    val = props[i]
    if (typeof val === 'string') {
      name = camelize(val)
      res[name] = { type: null }
    } else if (process.env.NODE_ENV !== 'production') {
      warn('props must be strings when using array syntax.')
    }
  }
} else if (isPlainObject(props)) {
  ...
} else if (process.env.NODE_ENV !== 'production') {
  ...
}
```

如果是一个数组，就用while循环遍历，其中有一个if语句：

```js
if (typeof val === 'string') 
```

也就是props数组中的元素必须是字符串，否则再非生产环境下会及进行警告。如果是字符串则进行：

```
name = camelize(val)
res[name] = { type: null }
```

先是将这个字符串类型的元素传入camlelize函数中，将中横线转驼峰形式的name。

然后在res对象上添加这个name的属性，其值为{type:null}

___

当props选项是对象的情况：

```js
if (Array.isArray(props)) {
  ...
} else if (isPlainObject(props)) {
  for (const key in props) {
    val = props[key]
    name = camelize(key)
    res[name] = isPlainObject(val)
      ? val
      : { type: val }
  }
} else if (process.env.NODE_ENV !== 'production') {
  ...
}
```

​		通过预先定义的工具函数isPlainObject判断props是否为一个纯对象，如果是的话遍历props中的每一个属性，同样把这些属性名通过camelize方法转成驼峰并赋值到name，然后将属性名为name的值的属性添加到res对象上，这时候还需要判断，这个name对应的属性值是否为一个纯对象，如果是的话就直接使用，否则该值将作为type的值创建一个新对象：{type: val}。如此就实现了对纯对象语法的规范化。

___

​		最后还有一个判断分支，如果这个props既不是数组也不是纯对象，则报出警告：

```
else if (process.env.NODE_ENV !== 'production') {
  warn(
    `Invalid value for option "props": expected an Array or an Object, ` +
    `but got ${toRawType(props)}.`,
    vm
  )
}
```

​		

