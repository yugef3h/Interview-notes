### 选项 props、methods、inject、computed 的合并策略

​		看完watch的合并策略，接下来的一段代码是：

```
/**
 * Other object hashes.
 */
strats.props =
strats.methods =
strats.inject =
strats.computed = function (
  parentVal: ?Object,
  childVal: ?Object,
  vm?: Component,
  key: string
): ?Object {
// 如果存在 childVal，那么在非生产环境下要检查 childVal 的类型
  if (childVal && process.env.NODE_ENV !== 'production') {
    assertObjectType(key, childVal, vm)
  }
// 如果parentVal不存在，则直接返回childVal
  if (!parentVal) return childVal
// 如果parentVal存在，则创建一个ret空对象，然后分别将parentVal和childVal的属性先后混合到ret上。注意：由于extend方法的内部实现，childVal将覆盖parentVal中的同名属性
  const ret = Object.create(null)
  extend(ret, parentVal)
  if (childVal) extend(ret, childVal)
// 最后返回ret
  return ret
}
```

​		如果 `parentVal` 存在，则使用 `extend` 方法将其属性混合到新对象 `ret` 中，如果 `childVal` 也存在的话，那么同样会再使用 `extend` 函数将其属性混合到 `ret` 中，所以如果父子选项中有相同的键，那么子选项会把父选项覆盖掉。

​		以上就是 `props`、`methods`、`inject` 以及 `computed` 这四个属性的通用合并策略。









____

### 选项provide的合并策略

​		最后一个选项的合并策略，就是 `provide` 选项的合并策略，只有一句代码，如下：

```js
strats.provide = mergeDataOrFn
```

​		也就是说 `provide` 选项的合并策略与 `data` 选项的合并策略相同，都是使用 `mergeDataOrFn` 函数。

