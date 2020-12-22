`_init` 函数在执行完 `initProxy` 之后，执行的就是 `initLifecycle` 函数：

```js
// expose real self
vm._self = vm
initLifecycle(vm)
```

​		在 `initLifecycle` 函数执行之前，执行了 `vm._self = vm` 语句，这句话在 `Vue` 实例对象 `vm` 上添加了 `_self` 属性，指向真实的实例本身。注意 `vm._self` 和 `vm._renderProxy` 不同，首先在用途上来说寓意是不同的，另外 `vm._renderProxy` 有可能是一个代理对象，即 `Proxy` 实例。

​		接下来执行的才是 `initLifecycle` 函数，同时将当前 `Vue` 实例 `vm` 作为参数传递，让我们具体看看这个initLifecycle函数的具体实现：

```js
export function initLifecycle (vm: Component) {
// 定义 options，它是 vm.$options 的引用，后面的代码使用的都是 options 常量
  const options = vm.$options

  // 如果当前实例有父组件，且当前实例不是抽象的
  // locate first non-abstract parent
  let parent = options.parent
  if (parent && !options.abstract) {
       // 使用 while 循环查找第一个非抽象的父组件
    while (parent.$options.abstract && parent.$parent) {
      parent = parent.$parent
    }
       // 经过上面的 while 循环后，parent 应该是一个非抽象的组件，将它作为当前实例的父级，所以将当前实例 vm 添加到父级的 $children 属性里
    parent.$children.push(vm)
  }

    // 设置当前实例的 $parent 属性，指向父级
  vm.$parent = parent
    // 设置 $root 属性，有父级就是用父级的 $root，否则 $root 指向自身
  vm.$root = parent ? parent.$root : vm

  vm.$children = []
  vm.$refs = {}

  vm._watcher = null
  vm._inactive = null
  vm._directInactive = false
  vm._isMounted = false
  vm._isDestroyed = false
  vm._isBeingDestroyed = false
}
```

​		首先将vm.$options赋予option常量，然后定义parent变量，指向当前实例的父实例，然后如果当前实例有父实例且当前实例不是抽象的，则使用whie循环查找第一个非抽象的父组件。经过whie循环后，parent应该是一个非抽象的组件，将它作为当前实例的父级，将当前实例vm天机道父级的$children属性中。然后设置当前实例的$parent属性指向这个找到的父级。然后设置$root属性，如果有父级则使用父级的$root，否则指向自身。

​		上面可以用一句话总结：将当前实例添加到父实例的$children属性中，并且设置当前实例的$parent指向父实例。

​		*什么是抽象的实例*？实际上 `Vue` 内部有一些选项是没有暴露给我们的，就比如这里的 `abstract`，通过设置这个选项为 `true`，可以指定该组件是抽象的，那么通过该组件创建的实例也都是抽象的，比如：

```js
AbsComponents = {
  abstract: true,
  created () {
    console.log('我是一个抽象的组件')
  }
}
```

​		抽象的组件有什么特点呢？一个最显著的特点就是它们一般不渲染真实DOM，这么说大家可能不理解，我举个例子大家就明白了，我们知道 `Vue` 内置了一些全局组件比如 `keep-alive` 或者 `transition`，我们知道这两个组件它是不会渲染DOM至页面的，但他们依然给我提供了很有用的功能。所以他们就是抽象的组件，我们可以查看一下它的源码，打开 `core/components/keep-alive.js` 文件，你能看到这样的代码：

```js
export default {
  name: 'keep-alive',
  abstract: true,
  ...
}
```

​		可以发现，它使用 `abstract` 选项来声明这是一个抽象组件。除了不渲染真实DOM，抽象组件还有一个特点，就是它们不会出现在父子关系的路径上。这么设计也是合理的，这是由它们的性质所决定的。

​		`initLifecycle` 函数还负责在当前实例上添加一些属性，即后面要执行的代码：

```js
vm.$children = []
vm.$refs = {}

vm._watcher = null
vm._inactive = null
vm._directInactive = false
vm._isMounted = false
vm._isDestroyed = false
vm._isBeingDestroyed = false
```

​		既然这些属性是在 `initLifecycle` 函数中定义的，那么自然会与生命周期有关。