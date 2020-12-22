执行完initEvents，接下来执行的是initRender函数：

```js
export function initRender (vm: Component) {
  vm._vnode = null // the root of the child tree
  vm._staticTrees = null // v-once cached trees
  const options = vm.$options
  const parentVnode = vm.$vnode = options._parentVnode // the placeholder node in parent tree
  const renderContext = parentVnode && parentVnode.context
  vm.$slots = resolveSlots(options._renderChildren, renderContext)
  vm.$scopedSlots = emptyObject
  // bind the createElement fn to this instance
  // so that we get proper render context inside it.
  // args order: tag, data, children, normalizationType, alwaysNormalize
  // internal version is used by render functions compiled from templates
  vm._c = (a, b, c, d) => createElement(vm, a, b, c, d, false)
  // normalization is always applied for the public version, used in
  // user-written render functions.
  vm.$createElement = (a, b, c, d) => createElement(vm, a, b, c, d, true)

  // $attrs & $listeners are exposed for easier HOC creation.
  // they need to be reactive so that HOCs using them are always updated
  const parentData = parentVnode && parentVnode.data

  /* istanbul ignore else */
  if (process.env.NODE_ENV !== 'production') {
    defineReactive(vm, '$attrs', parentData && parentData.attrs || emptyObject, () => {
      !isUpdatingChildComponent && warn(`$attrs is readonly.`, vm)
    }, true)
    defineReactive(vm, '$listeners', options._parentListeners || emptyObject, () => {
      !isUpdatingChildComponent && warn(`$listeners is readonly.`, vm)
    }, true)
  } else {
    defineReactive(vm, '$attrs', parentData && parentData.attrs || emptyObject, null, true)
    defineReactive(vm, '$listeners', options._parentListeners || emptyObject, null, true)
  }
}
```

​		现在我们逐行分析这段代码，首先是：

```js
vm._vnode = null // the root of the child tree
vm._staticTrees = null // v-once cached trees
```

​		这里给Vue实例添加了两个实例属性 `_vnode` 和 `_staticTrees`，并且这两个属性都是null，它们会在适当的时候被赋值，到时候再具体看看这两个属性的作用。

​		接下来的一段：

```js
const options = vm.$options
const parentVnode = vm.$vnode = options._parentVnode // the placeholder node in parent tree
const renderContext = parentVnode && parentVnode.context
vm.$slots = resolveSlots(options._renderChildren, renderContext)
vm.$scopedSlots = emptyObject
```

​		现在理解这段代码比较吃力，因为对_parentVnode、 _renderChildren以及 _parentVode.context不了解，并且这些属性牵扯了较多的东西，所以这些在后面再进行分析。

​		但可以知道的一点是，这段代码的作用就是在Vue实例上添加了三个实例属性：$vnode, $slots, $scopedSlots。

​		再往下的一段代码：

```
// bind the createElement fn to this instance
// so that we get proper render context inside it.
// args order: tag, data, children, normalizationType, alwaysNormalize
// internal version is used by render functions compiled from templates
vm._c = (a, b, c, d) => createElement(vm, a, b, c, d, false)
// normalization is always applied for the public version, used in
// user-written render functions.
vm.$createElement = (a, b, c, d) => createElement(vm, a, b, c, d, true)
```

​		这段代码给Vue实例添加了两个方法_c和 $createElement，这两个方法实际上都是对内部函数createElement的包装，根据注释可以知道， _c是用于通过template编译成render函数时调用的，而$createElement是用于我们手写的render函数的。比如在new Vue时传递的options中的render：

```js
render: function (createElement) {
  return createElement('h2', 'Title')
}
```

​		我们知道，渲染函数的第一个参数是createElement函数，该函数用于创建虚拟节点，实际上可以用下面这种写法代替：

```js
render: function () {
  return this.$createElement('h2', 'Title')
}
```

​		这两段代码是完全等价的。那么_c 和 $createElement的传递的第六个参数即alwaysNormalize是不同的，具体的原因后面再分析。

​		再往下就是initRender函数的最后一段代码了：

```js
// $attrs & $listeners are exposed for easier HOC creation.
// they need to be reactive so that HOCs using them are always updated
const parentData = parentVnode && parentVnode.data

/* istanbul ignore else */
if (process.env.NODE_ENV !== 'production') {
  defineReactive(vm, '$attrs', parentData && parentData.attrs || emptyObject, () => {
    !isUpdatingChildComponent && warn(`$attrs is readonly.`, vm)
  }, true)
  defineReactive(vm, '$listeners', options._parentListeners || emptyObject, () => {
    !isUpdatingChildComponent && warn(`$listeners is readonly.`, vm)
  }, true)
} else {
  defineReactive(vm, '$attrs', parentData && parentData.attrs || emptyObject, null, true)
  defineReactive(vm, '$listeners', options._parentListeners || emptyObject, null, true)
}
```

​		上面的代码主要作用就是在Vue实例上定义两个属性 $attrs 以及 $listeners。这两个属性的存在使得在Vue中创建高阶组件变得更容易。（可以阅读[探索Vue高阶组件](http://caibaojian.com/vue-design/more/vue-hoc.html)）

​		可以注意到在定义$attrs和 $listeners时用到了一个函数defineReactive，这个函数的作用就是为一个对象定义响应式的属性，所以$attrs和$listeners这两个属性是响应式的，至于defineReactive的具体实现等到我们去分析Vue的响应系统中再讲解。

​		另外，这段代码有一个对环境的判断，如果再非生产环境中传入的customSetter参数是一个函数，实际上这是一个setter，这个setter会在你设置$attrs或者$listeners属性时触发并且执行。比如当你试图修改$attrs属性时，会执行这个函数：

```js
() => {
  !isUpdatingChildComponent && warn(`$attrs is readonly.`, vm)
}
```

​		可以看到，当!isUpdatingChildComponent成立时，会提示你$attrs是只读属性，不应该手动修改它。$listeners属性也是相似的处理。

​		至于这里的isUpdatingChildComponent变量，可以看到它的定义所在文件lifecycle.js,可以发现有三个地方使用了这个变量：

```js
// 定义 isUpdatingChildComponent，并初始化为 false
export let isUpdatingChildComponent: boolean = false

// 省略中间代码 ...

export function updateChildComponent (
  vm: Component,
  propsData: ?Object,
  listeners: ?Object,
  parentVnode: MountedComponentVNode,
  renderChildren: ?Array<VNode>
) {
  if (process.env.NODE_ENV !== 'production') {
    isUpdatingChildComponent = true
  }

  // 省略中间代码 ...

  // update $attrs and $listeners hash
  // these are also reactive so they may trigger child update if the child
  // used them during render
  vm.$attrs = parentVnode.data.attrs || emptyObject
  vm.$listeners = listeners || emptyObject

  // 省略中间代码 ...

  if (process.env.NODE_ENV !== 'production') {
    isUpdatingChildComponent = false
  }
}
```

​		可以发现isUpdatingChildComponent初始值是false，只有当updateChildComponent函数开始执行的时候会更新为true，当执行结束时又会更新为false，只是因为执行updateChildComponent函数需要更新实例对象的$attrs和$listeners属性，所以此时不应该提示这两个是只读属性。

​		对于$attrs和$listeners属性到底是什么，有什么作用，等我们分析虚拟DOM的时候再回家来说明。