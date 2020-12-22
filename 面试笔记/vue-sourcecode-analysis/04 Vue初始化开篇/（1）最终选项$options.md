​		经过前面的学习，现在我们已经知道了选项合并的一个过程和策略，那么现在回到_init方法中一段：

```js
vm.$options = mergeOptions(
  resolveConstructorOptions(vm.constructor),
  options || {},
  vm
)
```

​		那么mergeOptions返回的options最终将作为这个Vue实例的属性$options的值。那么对于$options,官方是这么介绍的：

> 用于当前 `Vue` 实例的初始化选项。需要在选项中包含自定义属性时会有用处

​		并且给了一个例子，如下：

```js
new Vue({
  customOption: 'foo',
  created: function () {
    console.log(this.$options.customOption) // => 'foo'
  }
})
```

​		上面的例子中，在创建 `Vue` 实例的时候传递了一个自定义选项：`customOption`，在之后的代码中我们可以通过 `this.$options.customOption` 进行访问。那原理其实就是使用 `mergeOptions` 函数对自定义选项进行合并处理，由于没有指定 `customOption` 选项的合并策略，所以将会使用默认的策略函数 `defaultStrat`。最终效果就是你初始化的值是什么，得到的就是什么。

​		另外，`Vue` 也提供了 `Vue.config.optionMergeStrategies` 全局配置，只需要在 `Vue.config.optionMergeStrategies` 上添加与选项同名的策略函数即可，比如

```js
Vue.config.optionMergeStrategies.customOption = function (parentVal, childVal) {
    return parentVal ? (parentVal + childVal) : childVal
}
```

​		如上代码中，我们添加了自定义选项 `customOption` 的合并策略，其策略为：如果没有 `parentVal` 则直接返回 `childVal`，否则返回两者的和。

​		如下代码：

```js
// 创建子类
const Sub = Vue.extend({
    customOption: 1
})
// 以子类创建实例
const v = new Sub({
    customOption: 2,
    created () {
        console.log(this.$options.customOption) // 3
    }
})
```

​		最终，在实例的 `created` 方法中将打印数字 `3`。上面的例子很简单，没有什么实际作用，但这为我们提供了自定义选项的机会，这其实是非常有用的。

​		至于 `render` 和 `staticRenderFns` 这两个选项是在将模板编译成渲染函数时添加上去的，我们后面会遇到。另外 `_parentElm` 和 `_refElm` 这两个选项是在为虚拟DOM创建组件实例时添加的，我们后面分析模板编译的时候再去分析。

