​		在mergeOptions函数中的如下这段代码：

```
// Apply extends and mixins on the child options,
// but only if it is a raw options object that isn't
// the result of another mergeOptions call.
// Only merged options has the _base property.
if (!child._base) {
  if (child.extends) {
    parent = mergeOptions(parent, child.extends, vm)
  }
  if (child.mixins) {
    for (let i = 0, l = child.mixins.length; i < l; i++) {
      parent = mergeOptions(parent, child.mixins[i], vm)
    }
  }
}
```

​		当时没有深入讲解，因为当时还不了解mergeOptions函数的作用，现在可以回头看这段代码了。

​		我们知道mixins在Vue中用于解决代码复用的问题，比如混入created生命周期，用于打印一句话：

```js
const consoleMixin = {
  created () {
    console.log('created:mixins')
  }
}

new Vue ({
  mixins: [consoleMixin],
  created () {
    console.log('created:instance')
  }
})
```

​		运行以上代码，将打印两句话：

```js
// created:mixins
// created:instance
```

​		这是因为mergeOptions函数在处理mixins选项的时候递归调用了mergeOptions函数将mixins合并到了parent中，并将合并后生成的新对象作为新的parent：

```js
if (child.mixins) {
  for (let i = 0, l = child.mixins.length; i < l; i++) {
    parent = mergeOptions(parent, child.mixins[i], vm)
  }
}
```

​		上例中我们只涉及到 `created` 生命周期钩子的合并，所以会使用生命周期钩子的合并策略函数进行处理，现在我们已经知道 `mergeOptions` 会把生命周期选项合并为一个数组，所以所有的生命周期钩子都会被执行。那么不仅仅是生命周期钩子，任何写在 `mixins` 中的选项，都会使用 `mergeOptions` 中相应的合并策略进行处理，这就是 `mixins` 的实现方式。

​		对于 `extends` 选项，与 `mixins` 相同，甚至由于 `extends` 选项只能是一个对象，而不能是数组，反而要比 `mixins` 的实现更为简单，连遍历都不需要。