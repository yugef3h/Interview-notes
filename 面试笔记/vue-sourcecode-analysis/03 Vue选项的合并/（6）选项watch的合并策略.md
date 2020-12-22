​		看完资源选项的合并策略的定义以后，接下来的这段代码就是定义了watch的合并策略：

```js
/**
 * Watchers.
 *
 * Watchers hashes should not overwrite one
 * another, so we merge them as arrays.
 */
strats.watch = function (
  parentVal: ?Object,
  childVal: ?Object,
  vm?: Component,
  key: string
): ?Object {
  // work around Firefox's Object.prototype.watch...
  if (parentVal === nativeWatch) parentVal = undefined
  if (childVal === nativeWatch) childVal = undefined
  /* istanbul ignore if */
  if (!childVal) return Object.create(parentVal || null)
  if (process.env.NODE_ENV !== 'production') {
    assertObjectType(key, childVal, vm)
  }
  if (!parentVal) return childVal
  const ret = {}
  extend(ret, parentVal)
  for (const key in childVal) {
    let parent = ret[key]
    const child = childVal[key]
    if (parent && !Array.isArray(parent)) {
      parent = [parent]
    }
    ret[key] = parent
      ? parent.concat(child)
      : Array.isArray(child) ? child : [child]
  }
  return ret
}
```

​		这一段代码的作用是在 `strats` 策略对象上添加 `watch` 策略函数。

​		我们先看函数体开头的两句代码：

```js
// work around Firefox's Object.prototype.watch...
if (parentVal === nativeWatch) parentVal = undefined
if (childVal === nativeWatch) childVal = undefined
```

​		在 `Firefox` 浏览器中 `Object.prototype` 拥有原生的 `watch` 函数，所以即便一个普通的对象你没有定义 `watch` 属性，但是依然可以通过原型链访问到原生的 `watch` 属性，这就会给 `Vue` 在处理选项的时候造成迷惑，因为 `Vue` 也提供了一个叫做 `watch` 的选项，即使你的组件选项中没有写 `watch` 选项，但是 `Vue` 通过原型访问到了原生的 `watch`。这不是我们想要的，所以上面两句代码的目的是一个变通方案，当发现组件选项是浏览器原生的 `watch` 时，那说明用户并没有提供 `Vue` 的 `watch` 选项，直接重置为 `undefined`。

​		然后是这句代码：

```js
if (!childVal) return Object.create(parentVal || null)
```

​		检测了是否有 `childVal`，即组件选项是否有 `watch` 选项，如果没有的话，直接以 `parentVal` 为原型创建对象并返回(如果有 `parentVal` 的话)。

​		如果组件选项中有 `watch` 选项，即 `childVal` 存在，则代码继续执行，接下来将执行这段代码：

```js
if (process.env.NODE_ENV !== 'production') {
  assertObjectType(key, childVal, vm)
}
if (!parentVal) return childVal
```

​		由于此时 `childVal` 存在，所以在非生产环境下使用 `assertObjectType` 函数对 `childVal` 进行类型检测，检测其是否是一个纯对象，我们知道 `Vue` 的 `watch` 选项需要是一个纯对象。接着判断是否有 `parentVal`，如果没有的话则直接返回 `childVal`，即直接使用组件选项的 `watch`。

​		如果存在 `parentVal`，那么代码继续执行，此时 `parentVal` 以及 `childVal` 都将存在，那么就需要做合并处理了，也就是下面要执行的代码：

```js
const ret = {}
// 将 parentVal 的属性混合到 ret 中，后面处理的都将是 ret 对象，最后返回的也是 ret 对象
extend(ret, parentVal)
// 遍历 childVal
for (const key in childVal) {
// 由于遍历的是 childVal，所以 key 是子选项的 key，父选项中未必能获取到值，所以 parent 未必有值
  let parent = ret[key]
// child 是肯定有值的，因为遍历的就是 childVal 本身
  const child = childVal[key]
// 这个 if 分支的作用就是如果 parent 存在，就将其转为数组
  if (parent && !Array.isArray(parent)) {
    parent = [parent]
  }
  ret[key] = parent
    // 最后，如果 parent 存在，此时的 parent 应该已经被转为数组了，所以直接将 child concat 进去
    ? parent.concat(child)
    // 如果 parent 不存在，直接将 child 转为数组返回
    : Array.isArray(child) ? child : [child]
}
// 最后返回新的 ret 对象
return ret
```

​		根据逐行的代码解释很容易就能看懂这段代码所在做的事情了。首先定义了 `ret` 常量，最后返回的也是 `ret` 常量，所以中间的代码是在充实 `ret` 常量。之后使用 `extend` 函数将 `parentVal` 的属性混合到 `ret` 中。然后开始一个 `for in` 循环遍历 `childVal`，这个循环的目的是：*检测子选项中的值是否也在父选项中，如果在的话将父子选项合并到一个数组，否则直接把子选项变成一个数组返回*。

​		举个例子：

```js
// 创建子类
const Sub = Vue.extend({
  // 检测 test 的变化
  watch: {
    test: function () {
      console.log('extend: test change')
    }
  }
})

// 使用子类创建实例
const v = new Sub({
  el: '#app',
  data: {
    test: 1
  },
  // 检测 test 的变化
  watch: {
    test: function () {
      console.log('instance: test change')
    }
  }
})

// 修改 test 的值
v.test = 2
```

​		上面的代码中，当我们修改 `v.test` 的值时，两个观察 `test` 变化的函数都将被执行。

我们使用子类 `Sub` 创建了实例 `v`，对于实例 `v` 来讲，其 `childVal` 就是组件选项的 `watch`：

```js
watch: {
  test: function () {
    console.log('instance: test change')
  }
}
```

​		而其 `parentVal` 就是 `Sub.options`，实际上就是：

```js
watch: {
  test: function () {
    console.log('extend: test change')
  }
}
```

​		最终这两个 `watch` 选项将被合并为一个数组：

```js
watch: {
  test: [
    function () {
      console.log('extend: test change')
    },
    function () {
      console.log('instance: test change')
    }
  ]
}
```

​		但是 `watch.test` 并不一定总是数组，只有父选项(`parentVal`)也存在对该字段的观测时它才是数组，如下：

```js
// 创建实例
const v = new Vue({
  el: '#app',
  data: {
    test: 1
  },
  // 检测 test 的变化
  watch: {
    test: function () {
      console.log('instance: test change')
    }
  }
})

// 修改 test 的值
v.test = 2
```

​		我们直接使用 `Vue` 创建实例，这个时候对于实例 `v` 来说，父选项是 `Vue.options`，由于 `Vue.options` 并没有 `watch` 选项，所以逻辑将直接在 `strats.watch` 函数的这句话中返回：

```js
if (!parentVal) return childVal
```

​		则此时这个v的watch选项中就是：

```js
{
  test: function () {
    console.log('instance: test change')
  }
}
```

___

所以被合并处理后的 `watch` 选项下的每个键值，有可能是一个数组，也有可能是一个函数