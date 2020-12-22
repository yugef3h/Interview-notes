​		从函数命名来看，不难看出这个函数是用于合并选项的，这个函数在util下的options.js中定义，而在深入这个文件之前，当务之急是要弄清楚传入mergeOptions的三个参数到底是什么：

```js
vm.$options = mergeOptions(
    resolveConstructorOptions(vm.constructor),
    options || {},
    vm
)
```

​		其中第一个参数是通过调用一个函数得到的 ，这个函数叫做resolveConstructorOptions,并将vm.constructor作为参数传递进去，第二个参数就是我们new Vue时传入的options对象，第三个就是Vue实例本身，逐一看看这三个参数吧：

  		1. resolveConstructorOptions：

```js
export function resolveConstructorOptions (Ctor: Class<Component>) {
  let options = Ctor.options
  if (Ctor.super) {
    const superOptions = resolveConstructorOptions(Ctor.super)
    const cachedSuperOptions = Ctor.superOptions
    if (superOptions !== cachedSuperOptions) {
      // super option changed,
      // need to resolve new options.
      Ctor.superOptions = superOptions
      // check if there are any late-modified/attached options (#4976)
      const modifiedOptions = resolveModifiedOptions(Ctor)
      // update base extend options
      if (modifiedOptions) {
        extend(Ctor.extendOptions, modifiedOptions)
      }
      options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions)
      if (options.name) {
        options.components[options.name] = Ctor
      }
    }
  }
  return options
}
```

​		从名字看，意思就是解析构造器的选项。首先第一行：

```js
let options = Ctor.options
```

​		Ctor是传进来的参数：vm.constructor， 在我们这个例子中就是Vue构造函数。（也有不是Vue构造函数的时候，当使用Vue.extend创造一个子类并使用子类创造实例时，那么vm.constructor就不是Vue构造函数，而是子类：比如

```js
const Sub = Vue.extend()
const s = new Sub()
```

那么s.constructor就不是Vue而是Sub）

​		所以，Ctor.options在这里就是Vue.options，然后再看看resolveConstructorOptions最后的返回值：

```js
return options
```

​		也就是把Vue.options返回回去了，所以这个函数的确就是用来获取它的构造者的options的。那么在这中间还有一个由if包裹起来的代码块，条件是Ctor.super,而super是子类才有的属性：

```js
const Sub = Vue.extend()
console.log(Sub.super)  // Vue
```

​		再看这里面的第一句：

```js
const superOptions = resolveConstructorOptions(Ctor.super)
```

​		可以看出这是一个递归调用resolveConstructorOptions方法，参数是构造者的父类，之后的代码中，还有一些关于父类的options属性是否被改变过的判断和操作，并且注意这句代码：

```js
// check if there are any late-modified/attached options (#4976)
const modifiedOptions = resolveModifiedOptions(Ctor)
```

​		这句话根据括号内的 `issue` 索引去搜一下，可以知道是用来解决使用`vue-hot-reload-api` 或者 `vue-loader` 时产生的一个 `bug` 的。

​		关于这个if里面的问题后面在讲Vue.extend再进行详细分析，我们现在只需要看到有一个因素没有变，那就是resolveConstructorOptions这个函数的作用永远都是用来获取当前实例构造者的options属性的，几时经过这个if代码块也不例外，因为这个代码块只是对options进行了一些处理，最终返回的永远都是options。

​		所以根据我们的例子，resolveConstructorOptions函数目前不会走if判断分支内的代码块，即此时这个函数相当于：

```js
export function resolveConstructorOptions (Ctor: Class<Component>) {
  let options = Ctor.options
  return options
}
```

​		根据我们的例子，此时的mergeOptions函数的第一个参数就是Vue.options，那么这个Vue.options的样子在初始化时就被定义过了（我们之前分析构造函数初始化时已经看过了）：

```js
Vue.options = {
	components: {
		KeepAlive
		Transition,
    	TransitionGroup
	},
	directives:{
	    model,
        show
	},
	filters: Object.create(null),
	_base: Vue
}
```

____

​		接下来再看第二个参数options,这个参数实际上就是我们new Vue时传入的一个对象，所以根据我们的例子这个options就是:

```
{
	el:'#app',
	data:{
		test: 1
	}
}
```

___

​		第三个参数vm就是Vue实例对象本身。

____

​		综上所述，最终如下代码：

```js
vm.$options = mergeOptions(
  resolveConstructorOptions(vm.constructor),
  options || {},
  vm
)
```

​		相当于：

```js
vm.$options = mergeOptions(
  // resolveConstructorOptions(vm.constructor)
  {
    components: {
      KeepAlive
      Transition,
      TransitionGroup
    },
    directives:{
      model,
      show
    },
    filters: Object.create(null),
    _base: Vue
  },
  // options || {}
  {
    el: '#app',
    data: {
      test: 1
    }
  },
  vm
)
```

​		现在我们弄清楚mergeOptions函数的三个参数了，接下来就打开core/util/options.js文件去看看mergeOptions方法内部具体做了什么事情。