​		看完strats的定义，接下来出现了两个函数：mergeData和mergeDataOrFn，暂且不关注这两个函数，跳过继续往下看：

```js
strats.data = function (
  parentVal: any,
  childVal: any,
  vm?: Component
): ?Function {
  if (!vm) {
    if (childVal && typeof childVal !== 'function') {
      process.env.NODE_ENV !== 'production' && warn(
        'The "data" option should be a function ' +
        'that returns a per-instance value in component ' +
        'definitions.',
        vm
      )

      return parentVal
    }
    return mergeDataOrFn(parentVal, childVal)
  }

  return mergeDataOrFn(parentVal, childVal, vm)
}
```

​		这段代码可以看出这是data这个选项的合并策略，首先是一个if判断语句，条件是!vm，还记得上面我们提到过可以通过是否传递了vm来判断这是不是一个子组件，那么vm没有传入时，表示当前是一个子组件，那么如果这个子组件的data不是一个function类型还将会报出警告，并且直接返回parentVal。如果这个子组件的data是function类型，那么就返回mergeDataOrFn函数的执行结果：

```js
return mergeDataOrFn(parentVal, childVal)
```

​		以上都是在当前处理的是子组件的选项，如果是通过new操作符创建的实例的选项，这时候也会返回mergeDataOrFn,不过多传了一个vm参数：

```js
return mergeDataOrFn(parentVal, childVal, vm)
```

​		所以无论处理的是否子组件的选项，最终都会调用mergeDataOrFn函数进行处理，并且其返回的结果作为合并策略的结果返回合并后的选项值，唯一的区别就是是否多传了vm参数。接下来就看看mergeDataOrFn的具体实现：

```js
/**
 * Data
 */
export function mergeDataOrFn (
  parentVal: any,
  childVal: any,
  vm?: Component
): ?Function {
  if (!vm) {
    // in a Vue.extend merge, both should be functions
    if (!childVal) {
      return parentVal
    }
    if (!parentVal) {
      return childVal
    }
    // when parentVal & childVal are both present,
    // we need to return a function that returns the
    // merged result of both functions... no need to
    // check if parentVal is a function here because
    // it has to be a function to pass previous merges.
    return function mergedDataFn () {
      return mergeData(
        typeof childVal === 'function' ? childVal.call(this, this) : childVal,
        typeof parentVal === 'function' ? parentVal.call(this, this) : parentVal
      )
    }
  } else {
    return function mergedInstanceDataFn () {
      // instance merge
      const instanceData = typeof childVal === 'function'
        ? childVal.call(vm, vm)
        : childVal
      const defaultData = typeof parentVal === 'function'
        ? parentVal.call(vm, vm)
        : parentVal
      if (instanceData) {
        return mergeData(instanceData, defaultData)
      } else {
        return defaultData
      }
    }
  }
}
```

​		这个函数整体由 `if` 判断分支语句块组成，首先对 `vm` 进行判断，如果没有拿到 `vm` 参数的话，那说明处理的是子组件选项，程序会走 `if` 分支，实际上我们可以看到这里有段注释：

```js
// in a Vue.extend merge, both should be functions
```

​		注释的意思是：选项是在调用 `Vue.extend` 函数时进行合并处理的，此时父子 `data` 选项都应该是函数。这再次说明了，当拿不到 `vm` 这个参数的时候，合并操作是在 `Vue.extend` 中进行的，也就是在处理子组件的选项。而且此时 `childVal` 和 `parentVal` 都应该是函数，那么这里真的能保证 `childVal` 和 `parentVal` 都是函数了吗？其实是可以的，我们后面会讲到。

在这句注释的下面是这段代码：

```js
if (!childVal) {
  return parentVal
}
if (!parentVal) {
  return childVal
}
```

​		我们看第一个 `if` 语句块，如果没有 `childVal`，也就是说子组件的选项中没有 `data` 选项，那么直接返回 `parentVal`，比如下面的代码：

```js
Vue.extend({})
```

​		这时候传递的子组件选项是一个空对象，即没有 `data` 选项，那么此时 `parentVal` 实际上就是 `Vue.options`，由于 `Vue.options` 上也没有 `data` 这个属性，所以压根就不会执行 `strats.data` 策略函数，也就更不会执行 `mergeDataOrFn` 函数。

​		虽然上面这个例子中，parentVal为空，但parentVal的返回必然有其意义，说明存在childVal为空，但parentVal不为空的情况，比如：

```js
const Parent = Vue.extend({
  data: function () {
    return {
      test: 1
    }
  }
})

const Child = Parent.extend({})
```

​		上面的代码中 `Parent` 类继承了 `Vue`，而 `Child` 又继承了 `Parent`，我们使用 `Parent.extend` 创建 `Child` 子类的时候，对于 `Child` 类来讲，`childVal` 不存在，因为我们没有传递 `data` 选项，但是 `parentVal` 存在，即 `Parent.options` 下的 `data` 选项。那么这个Parent.options就是`Vue.extend` 函数内使用 `mergeOptions` 生成的，所以此时 `parentVal` 必定是个函数，因为 `strats.data` 策略函数在处理 `data` 选项后返回的始终是一个函数。

```js
if (!childVal) {
  return parentVal
}
if (!parentVal) {
  return childVal
}
```

​		对于这段代码，可以得出结论：*如果没有子选项则使用父选项，没有父选项就直接使用子选项，且这两个选项都能保证是函数*，如果父子选项同时存在，则代码继续进行，将执行下面的代码：

```js
 // when parentVal & childVal are both present,
  // we need to return a function that returns the
  // merged result of both functions... no need to
  // check if parentVal is a function here because
  // it has to be a function to pass previous merges.
  return function mergedDataFn () {
    return mergeData(
      typeof childVal === 'function' ? childVal.call(this, this) : childVal,
      typeof parentVal === 'function' ? parentVal.call(this, this) : parentVal
    )
  }
}
```

​		也就是说，当父子选项同时存在，那么就返回一个函数 `mergedDataFn`，注意：此时代码运行就结束了，因为函数已经返回了(`return`)，至于 `mergedDataFn` 函数里面又返回了 `mergeData` 函数的执行结果这句代码目前还没有执行。

​		说完了处理子组件选项的情况，我们再看看处理非子组件选项的情况，也就是使用 `new` 操作符创建实例时的情况，此时程序直接执行 `strats.data` 函数的最后一句代码：

```js
return mergeDataOrFn(parentVal, childVal, vm)
```

​		发现同样是调用 `mergeDataOrFn` 函数，只不过这个时候传递了 `vm` 参数，那么在mergeDataOrFn中就意味着执行的是else分支：

```js
else {
  return function mergedInstanceDataFn () {
    // instance merge
    const instanceData = typeof childVal === 'function'
      ? childVal.call(vm, vm)
      : childVal
    const defaultData = typeof parentVal === 'function'
      ? parentVal.call(vm, vm)
      : parentVal
    if (instanceData) {
      return mergeData(instanceData, defaultData)
    } else {
      return defaultData
    }
  }
}
```

​		这里直接返回mergedInstanceDataFn函数，注意测试这个函数同样没有执行，它是mergeDataOrFn函数的返回值，所以再次说明了一件事：mergeDataOrFn函数永远返回一个函数。

​		以我们开始的例子来说:

```js
let v = new Vue({
  el: '#app',
  data: {
    test: 1
  }
})
```

​		我们的 `data` 选项在经过 `mergeOptions` 处理之后将变成一个函数，且根据我们的分析，它就是 `mergedInstanceDataFn` 函数。

____

​		现在我们了解到一个试试，即data选项最终被mergeOptions函数处理成了一个函数，当合并处理的是子组件的选项是，data函数有三种可能：

1. 值为该子组件的data选项本身，因为子组件的data选项本身就是一个函数，即如下mergeDataOrFn函数的代码所示：

```js
export function mergeDataOrFn (
  parentVal: any,
  childVal: any,
  vm?: Component
): ?Function {
  if (!vm) {
    ...
    // 返回子组件的 data 选项本身
    if (!parentVal) {
      return childVal
    }
    ...
  } else {
    ...
  }
}
```

2. 值为父类的data选项，也就是这段代码：

```js
 // 返回父类的 data 选项
    if (!childVal) {
      return parentVal
    }
```

3. 值为mergedDataFn函数，如下代码：

```js
 return function mergedDataFn () {
      return mergeData(
        typeof childVal === 'function' ? childVal.call(this, this) : childVal,
        typeof parentVal === 'function' ? parentVal.call(this, this) : parentVal
      )
    }
```



​		当处理的是非子组件的data选项时，data的值为mergedInstanceDataFn函数：

```js
export function mergeDataOrFn (
  parentVal: any,
  childVal: any,
  vm?: Component
): ?Function {
  if (!vm) {
    ...
  } else {
    // 当合并处理的是非子组件的选项时 `data` 函数为 `mergedInstanceDataFn` 函数
    return function mergedInstanceDataFn () {
      // instance merge
      const instanceData = typeof childVal === 'function'
        ? childVal.call(vm, vm)
        : childVal
      const defaultData = typeof parentVal === 'function'
        ? parentVal.call(vm, vm)
        : parentVal
      if (instanceData) {
        return mergeData(instanceData, defaultData)
      } else {
        return defaultData
      }
    }
  }
}
```

____

​		通过分析data的各种可能性，可以发现data选项的值一定是函数类型的，并且有一个共同的特点：这些函数的执行结果就是最终的数据。再进一步看，data选项的值存在的情况下要么是mergedDataFn要么是mergedInstanceDataFn，子类的data选项存在的情况下，这两个函数内部都调用了mergeData函数。先看看在mergedDataFn函数中调用mergeData函数时：

```js
return function mergedDataFn () {
  return mergeData(
    typeof childVal === 'function' ? childVal.call(this, this) : childVal,
    typeof parentVal === 'function' ? parentVal.call(this, this) : parentVal
  )
}
```

​		这个函数直接返回了mergeData的执行结果，再看看mergedInstanceDataFn函数中调用mergeData时：

```js
return function mergedInstanceDataFn () {
  // instance merge
  const instanceData = typeof childVal === 'function'
    ? childVal.call(vm, vm)
    : childVal
  const defaultData = typeof parentVal === 'function'
    ? parentVal.call(vm, vm)
    : parentVal
  if (instanceData) {
    return mergeData(instanceData, defaultData)
  } else {
    return defaultData
  }
}
```

​		可以发现这两段代码都有类似的代码：

```js
typeof childVal === 'function' ? childVal.call(this, this) : childVal
typeof parentVal === 'function' ? parentVal.call(this, this) : parentVal
```

​		我们知道 `childVal` 要么是子组件的选项，要么是使用 `new` 操作符创建实例时的选项，无论是哪一种，总之 `childVal` 要么是函数，要么就是一个纯对象，所以如果是函数的话就通过执行该函数从而获取到一个纯对象。

​		所以在调用mergeData时传递的两个参数都是纯对象类型的，那么接下来就看看mergeData的内部实现:

```js
/**
 * Helper that recursively merges two data objects together.
 */
function mergeData (to: Object, from: ?Object): Object {
     // 没有 from 直接返回 to
  if (!from) return to
  let key, toVal, fromVal

  // 遍历 from 的 key
  const keys = hasSymbol
    ? Reflect.ownKeys(from)
    : Object.keys(from)

  for (let i = 0; i < keys.length; i++) {
    key = keys[i]
      //这里子选项的data还没有加入响应系统，不应该在这里给子选项的data加上__ob__这个属性
    // in case the object is already observed...
    if (key === '__ob__') continue
    toVal = to[key]
    fromVal = from[key]
      // 如果 from 对象中的 key 不在 to 对象中，则使用 set 函数为 to 对象设置 key 及相应的值
    if (!hasOwn(to, key)) {
      set(to, key, fromVal)
    } 
        // 如果 from 对象中的 key 也在 to 对象中，且这两个属性的值都是纯对象则递归进行深度合并
      else if (
      toVal !== fromVal &&
      isPlainObject(toVal) &&
      isPlainObject(fromVal)
    ) {
      mergeData(toVal, fromVal)
    }
      // 其他情况什么都不做
  }
  return to
}
```

​		看最后一行，return to，可以知道mergeData函数的作用就是就from对象的属性混合到to对象中，也就是将父类的data选项的值混合到子类的data选项中。整段代码较为复杂一点的就是：

```js
else if (
  toVal !== fromVal &&
  isPlainObject(toVal) &&
  isPlainObject(fromVal)
) {
  mergeData(toVal, fromVal)
}
```

​		也就是说，如果当两个key值对应的值都是一个纯对象的话则会进行递归深度合并。

​		另外，mergeData函数中还调用了一个set函数，实际上这个set函数就是暴露给全局API的Vue.$set方法，这里暂时先不看set函数的具体实现，但我们可以简单理解为它的功能就是将一个键值对添加到一个对象身上。



____

​	一些问题：

## 1.为什么最终strats.data要处理成一个函数？

​		这是因为通过函数返回数据对象，可以保证每个组件实例都有一个唯一的数据副本，避免了组件间数据互相影响。



## 2.为什么不在合并阶段就把数据合并好，而是等到初始化的时候再合并数据？

​		我们知道在合并阶段 `strats.data` 将被处理成一个函数，但是这个函数并没有被执行，而是到了后面初始化的阶段才执行的，这个时候才会调用 `mergeData` 对数据进行合并处理，那这么做的目的是什么呢？其实这么做是有它的道理的，后面我们去分析Vue的初始化的时候，大家就会发现inject和props这两个选项的初始化是先于data选项的，这就保证了我们能够使用props初始化data中的数据，如下：

```js
// 子组件：使用 props 初始化子组件的 childData 
const Child = {
  template: '<span></span>',
  data () {
    return {
      childData: this.parentData
    }
  },
  props: ['parentData'],
  created () {
    // 这里将输出 parent
    console.log(this.childData)
  }
}

var vm = new Vue({
    el: '#app',
    // 通过 props 向子组件传递数据
    template: '<child parent-data="parent" />',
    components: {
      Child
    }
})
```

​		如上例所示，子组件的数据 `childData` 的初始值就是 `parentData` 这个 `props`。而之所以能够这样做的原因有两个：

		1. 由于props的初始化先于data选项的初始化
  		2. data选项是在初始化的时候才求值的，也可以理解为在初始化的时候才使用mergeData进行数据合并。

