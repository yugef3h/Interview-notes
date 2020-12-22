​		最后一个规范化函数是normalizeDirectives:

```js
/**
 * Normalize raw function directives into object format.
 */
function normalizeDirectives (options: Object) {
  const dirs = options.directives
  if (dirs) {
    for (const key in dirs) {
      const def = dirs[key]
      if (typeof def === 'function') {
        dirs[key] = { bind: def, update: def }
      }
    }
  }
}
```

​		同样这个函数也是讲directives规范化为对象类型。

​		我们知道，directives选项是用来进行注册局部命令的，比如下面的代码我们注册了两个局部指令：分别是v-test1和v-test2：

```js
<div id="app" v-test1 v-test2>{{test}}</div>

var vm = new Vue({
  el: '#app',
  data: {
    test: 1
  },
  // 注册两个局部指令
  directives: {
    test1: {
      bind: function () {
        console.log('v-test1')
      }
    },
    test2: function () {
      console.log('v-test2')
    }
  }
})
```

​		但这两个指令的注册方式不同，v-test1指令我们使用对象语法，v-test2指令我们使用的则是一个函数。所以既然有不同的写法，那么就得进行相应的规范化了：

```js
for (const key in dirs) {
  const def = dirs[key]
  if (typeof def === 'function') {
    dirs[key] = { bind: def, update: def }
  }
}
```

​		如果是对象形式不需要作处理。		

​		当注册的指令的值是一个函数时，就讲该函数作为对象形式的bind属性和update属性的值，就像一种语法糖。

____

​		至此，我们已经彻底了解了这三个用于规范化的函数的作用了，那么在mergeOptions中，执行完这三个规范化函数以后接下来是这样一段代码：

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

​		首先，判断child._base是否存在，其意义是只有当child是一个原始的options对象而不是被mergeOptions产生的对象，判断的原理是只有被mergeOptions过才会有 _base属性。

​		如果child是一个原始对象，则继续执行，处理extends选项和mixins选项。

​		首先如果child.extends存在，则递归调用mergeOptions将parent与child.extends进行合并，并将结果作为新的parent。注意这里，之所以说mergeOptions会产生一个新的对象，是因为此时parent已经被新的对象重新赋值了。

​		接着检测child.mixins选项是否存在，如果存在则使用同样的方式进行操作，不同的是这里mixins是一个数组，需要遍历一下。

​		经过上面的两个判断分支，此时的parent很可能已经不是当初的parent，而是经过合并后产生的新的对象。关于extends和mixins的更多东西以及这里递归调用的mergeOptions所产生的影响，等我们看完整个mergeOptions对选项的处理之后会更容易理解，因为现在还不清楚mergeOptions到底怎么合并选项，稍后再回头看这段代码。

​		到目前为止，我们所看到的mergeOptions的代码，还都是对选项的规范化，或者说现在做的事都还只是对parent和child进行预处理，这些是接下来合并选项所必要的步骤。

