​		在看完 `runtime/index.js` 文件之后，其实 `运行时` 版本的 `Vue` 构造函数就已经“成型了”。我们可以打开 `entry-runtime.js` 这个入口文件，这个文件只有两行代码：

```js
import Vue from './runtime/index'

export default Vue
```

​		可以发现，`运行时` 版的入口文件，导出的 `Vue` 就到 `./runtime/index.js` 文件为止。然而我们所选择的并不仅仅是运行时版，而是完整版的 `Vue`，入口文件是 `entry-runtime-with-compiler.js`，我们知道完整版和运行时版的区别就在于 `compiler`，所以其实在我们看这个文件的代码之前也能够知道这个文件的作用：*就是在运行时版的基础上添加 `compiler`*

​		打开 `entry-runtime-with-compiler.js` 文件：

```js
// ... 其他 import 语句

// 导入 运行时 的 Vue
import Vue from './runtime/index'

// ... 其他 import 语句

// 从 ./compiler/index.js 文件导入 compileToFunctions
import { compileToFunctions } from './compiler/index'

// 根据 id 获取元素的 innerHTML
const idToTemplate = cached(id => {
  const el = query(id)
  return el && el.innerHTML
})

// 使用 mount 变量缓存 Vue.prototype.$mount 方法
const mount = Vue.prototype.$mount
// 重写 Vue.prototype.$mount 方法
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
  // ... 函数体省略
}

/**
 * 获取元素的 outerHTML
 */
function getOuterHTML (el: Element): string {
  if (el.outerHTML) {
    return el.outerHTML
  } else {
    const container = document.createElement('div')
    container.appendChild(el.cloneNode(true))
    return container.innerHTML
  }
}

// 在 Vue 上添加一个全局API `Vue.compile` 其值为上面导入进来的 compileToFunctions
Vue.compile = compileToFunctions

// 导出 Vue
export default Vue
```

​		这个文件运行下来，对 `Vue` 的影响有两个，第一个影响是它重写了 `Vue.prototype.$mount` 方法；第二个影响是添加了 `Vue.compile` 全局API。其中通过compileToFunctions这个函数将手写的template模板编译成render函数，那么这个方法是在重写的$mount当中，可以理解为完整版的$mount就是在执行之前的$mount方法之前将template模板转成了render函数。