​		在 `Vue` 中 `directives`、`filters` 以及 `components` 被认为是资源，其实很好理解，指令、过滤器和组件都是可以作为第三方应用来提供的，比如你需要一个模拟滚动的组件，你当然可以选用超级强大的第三方组件 [scroll-flip-page](https://github.com/HcySunYang/scroll-flip-page)，所以这样看来 [scroll-flip-page](https://github.com/HcySunYang/scroll-flip-page) 就可以认为是资源，除了组件之外指令和过滤器也都是同样的道理。

​		而我们接下来要看的代码就是用来合并处理 `directives`、`filters` 以及 `components` 等资源选项的，看如下代码：

```
/**
 * Assets
 *
 * When a vm is present (instance creation), we need to do
 * a three-way merge between constructor options, instance
 * options and parent options.
 */
function mergeAssets (
  parentVal: ?Object,
  childVal: ?Object,
  vm?: Component,
  key: string
): Object {
  const res = Object.create(parentVal || null)
  if (childVal) {
    process.env.NODE_ENV !== 'production' && assertObjectType(key, childVal, vm)
    return extend(res, childVal)
  } else {
    return res
  }
}

ASSET_TYPES.forEach(function (type) {
  strats[type + 's'] = mergeAssets
})
```

​		与生命周期钩子的合并处理策略基本一致，以上代码段也分为两部分：`mergeAssets` 函数以及一个 `forEach` 语句，同样先看最下面一段，对ASSET_TYPES进行遍历，而ASSET_TYPES的定义为：

```js
export const ASSET_TYPES = [
  'component',
  'directive',
  'filter'
]
```

​		我们发现 `ASSET_TYPES` 其实是由与资源选项“同名”的三个字符串组成的数组，注意所谓的“同名”是带引号的，因为数组中的字符串与真正的资源选项名字相比要少一个字符 `s`。

| ASSET_TYPES | 资源选项名字 |
| ----------- | :----------: |
| component   | component`s` |
| directive   | directive`s` |
| filter      |  filter`s`   |

​		所以可以看到在循环内部都有一个手动拼接‘s'的操作，所以最终的结果激素hi在strats策略对象上添加与资源选项名字相同的策略函数，用来分别合并处理三类资源。下面具体看看这个mergeAssets函数的具体实现：

```js
function mergeAssets (
  parentVal: ?Object,
  childVal: ?Object,
  vm?: Component,
  key: string
): Object {
  const res = Object.create(parentVal || null)
  if (childVal) {
    process.env.NODE_ENV !== 'production' && assertObjectType(key, childVal, vm)
    return extend(res, childVal)
  } else {
    return res
  }
}
```

​		上面的代码本身逻辑很简单，首先以 `parentVal` 为原型创建对象 `res`，然后判断是否有 `childVal`，如果有的话使用 `extend` 函数将 `childVal` 上的属性混合到 `res` 对象上并返回。如果没有 `childVal` 则直接返回 `res`。

​		最后说一下 `mergeAssets` 函数中的这句话：

```js
process.env.NODE_ENV !== 'production' && assertObjectType(key, childVal, vm)
```

​		在非生产环境下，会调用 `assertObjectType` 函数，这个函数其实是用来检测 `childVal` 是不是一个纯对象的，如果不是纯对象会给你一个警告，其源码很简单，如下：

```js
function assertObjectType (name: string, value: any, vm: ?Component) {
  if (!isPlainObject(value)) {
    warn(
      `Invalid value for option "${name}": expected an Object, ` +
      `but got ${toRawType(value)}.`,
      vm
    )
  }
}
```

​		上面我们都在以 `components` 进行讲解，对于指令(`directives`)和过滤器(`filters`)也是一样的，因为他们都是用 `mergeAssets` 进行合并处理。