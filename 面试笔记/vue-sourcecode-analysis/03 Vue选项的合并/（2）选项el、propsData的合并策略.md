​		在options文件之前，optionMergeStrategies还是一个空对象，接下来看看这个strates (config.optionMergeStrategies)在options文件中进行的一些覆写，看看都有哪些合并策略：

```js
/**
 * Options with restrictions
 */
if (process.env.NODE_ENV !== 'production') {
  strats.el = strats.propsData = function (parent, child, vm, key) {
    if (!vm) {
      warn(
        `option "${key}" can only be used during instance ` +
        'creation with the `new` keyword.'
      )
    }
    return defaultStrat(parent, child)
  }
}
```

​			非生产环境下在strats策略对象上添加两个策略（属性）分别是el和propsData，且这两个属性的值是同一个函数。与其说合并，事实上说是处理更贴切一些，因为它并没有做什么合并工作。那么看看这个策略函数的内容，首先是if判断分支，条件是是否传递了vm参数，如果没有传递这个参数就警告el或者propsData选项只能在new 操作符创建实例的时候可用。比如下面：

```js
// 子组件
var ChildComponent = {
  el: '#app2',
  created: function () {
    console.log('child component created')
  }
}

// 父组件
new Vue({
  el: '#app',
  data: {
    test: 1
  },
  components: {
    ChildComponent
  }
})
```

​		上面的代码中父组件使用了el选项，这没有问题，但是在这个子组件中也使用了el选项，这就会得到上面所说的警告。这说明了一个问题，即在策略函数中如果拿不到vm参数，那说明处理的是子组件选项。

​		有趣的是为什么没有vm参数就可以判断这是一个子组件呢？

​		首先，这个vm是从mergeOptions函数传进来的，那么这个mergeOptions函数在哪里被调用的呢？目前我们知道的是在构造函数的_init方法中调用的：

```
vm.$options = mergeOptions(
  resolveConstructorOptions(vm.constructor),
  options || {},
  vm
)
```

​		这种情况下vm就是当前Vue的实例，是不为空的。那么如果可以通过!vm来判断是否是子组件，说明确实有在另外一个地方可以调用mergeOptions函数，且不传第三个参数。通过全局搜索，可以在core/global-api/extend.js中找到，就在extend这个API的定义中, 其中有一段：

```
Sub.options = mergeOptions(
  Super.options,
  extendOptions
)
```

​		可以发现，此时调用的mergeOptions没有传递第三个参数，也就是说通过Vue.extend创建子类时会调用mergeOptions，这时策略函数就拿不到第三个参数vm。

​		现在就比较明朗了，在策略函数中通过判断是否存在vm就能够得知mergeOptions是在实例化时调用(使用 `new` 操作符走 `_init` 方法)还是在继承时调用(`Vue.extend`)，而子组件的实现方式就是通过实例化子类完成的，子类又是通过Vue.extend创造出来的，所以就可以通过对vm的判断是否为空来得知当前是否是一个子组件了。

​		最终的结论就是：如果策略函数拿不到vm参数，那么处理的就是子组件的选项。

​		接着看`strats.el` 和 `strats.propsData` 策略函数的代码：

```js
return defaultStrat(parent, child)
```

​		这个defaultStrat函数源码如下：

```js
/**
 * Default strategy.
 */
const defaultStrat = function (parentVal: any, childVal: any): any {
  return childVal === undefined
    ? parentVal
    : childVal
}
```

​		实际上 `defaultStrat` 函数就如同它的名字一样，它是一个默认的策略，当一个选项不需要特殊处理的时候就使用默认的合并策略，它的逻辑很简单：只要子选项不是 `undefined` 那么就是用子选项，否则使用父选项。

​		但是大家还要注意一点，`strats.el` 和 `strats.propsData` 这两个策略函数是只有在非生产环境才有的，在生产环境下访问这两个函数将会得到 `undefined`，那这个时候 `mergeField` 函数的第一句代码就起作用了：

```js
// 当一个选项没有对应的策略函数时，使用默认策略
const strat = strats[key] || defaultStrat
```

​		所以在生产环境将直接使用默认的策略函数 `defaultStrat` 来处理 `el` 和 `propsData` 这两个选项。（饶了一大圈，我觉得这段代码的唯一作用就是在开发环境下对子组件调用el和propsData选项进行警告用户不可以在子组件中调用这两个属性）。

