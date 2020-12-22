​		initData的最后一句代码：

```js
// observe data
observe(data, true /* asRootData */)
```

​		调用了observe函数观测数据，我们看看observe的具体实现：

```js
/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 */
export function observe (value: any, asRootData: ?boolean): Observer | void {
  if (!isObject(value) || value instanceof VNode) {
    return
  }
  let ob: Observer | void
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__
  } else if (
    shouldObserve &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    ob = new Observer(value)
  }
  if (asRootData && ob) {
    ob.vmCount++
  }
  return ob
}
```

​		observe函数接收两个参数，第一个参数是要观测的数据，第二个参数是一个布尔值，代表被观测的数据是否是根级数据。observe函数的第一段：

```js
if (!isObject(value) || value instanceof VNode) {
  return
}
```

​		判断要观测的数据如果不是对象类型或者它是一个VNode实例，则直接return退出函数的执行。接着声明Observe或void类型的变量ob，用于保存Observe实例，并且我们可以发现observe函数的最后就是返回这个ob。

​		接着是：

```js
if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
  ob = value.__ob__
} else if (
  shouldObserve &&
  !isServerRendering() &&
  (Array.isArray(value) || isPlainObject(value)) &&
  Object.isExtensible(value) &&
  !value._isVue
) {
  ob = new Observer(value)
}
```

​		这段首先判断这个数据身上是否带有`__ob__`属性并且这个 `__ob__`是Observe类型的，如果是的话，ob就指向这个`__ob__`。那么`__ob__`是什么呢？当一个数据对象被观测之后将会在该对象上定义`__ob__`属性，所以这个if分支的作用是用来避免重复观察一个数据对象的。

​		接着再看看else if分支，第一个条件是shouldObserve要为true。看看这个shouldObserve是如何定义的：

```js
/**
 * In some cases we may want to disable observation inside a component's
 * update computation.
 */
export let shouldObserve: boolean = true

export function toggleObserving (value: boolean) {
  shouldObserve = value
}
```

​		可以看出，这个shouldObserve变量初始值是true，并且在它下面定义了一个toggleObserving函数用于切换这个shouldObserve的值，就像一个开关。至于什么时候会关掉我们后面看到到有相关的使用再去分析它。

​		第二个条件：`!isServerRendering()` ，这是一个用于判断当前环境是否是服务端渲染的方法，也就是说只有当不是服务端渲染的时候才会观测数据。

​		第三个条件：`(Array.isArray(value) || isPlainObject(value))` 。判断这个需要观测的数据是否是一个数组或者纯对象。

​		第四个条件：`Object.isExtensible(value)`，判断这个数据可以不可以在上面添加属性。

​		第五个条件：`!value._isVue`。之前我们在看_init方法的时候看到过， _isVue属性用于标记当前对象是否是一个Vue实例，这个属性存在的意义也是为了避免Vue实例被观察。

​		当需要被观测的对象满足以上五个条件时，就会执行：`ob = new Observer(value)`，即创建一个Observe实例。那么我们接下来看看Observe这个构造函数长什么样子。

___

### Observe构造函数：

```js
/**
 * Observer class that is attached to each observed
 * object. Once attached, the observer converts the target
 * object's property keys into getter/setters that
 * collect dependencies and dispatch updates.
 */
export class Observer {
  value: any;
  dep: Dep;
  vmCount: number; // number of vms that have this object as root $data

  constructor (value: any) {
    this.value = value
    this.dep = new Dep()
    this.vmCount = 0
    def(value, '__ob__', this)
    if (Array.isArray(value)) {
      if (hasProto) {
        protoAugment(value, arrayMethods)
      } else {
        copyAugment(value, arrayMethods, arrayKeys)
      }
      this.observeArray(value)
    } else {
      this.walk(value)
    }
  }

  /**
   * Walk through all properties and convert them into
   * getter/setters. This method should only be called when
   * value type is Object.
   */
  walk (obj: Object) {
    const keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i])
    }
  }

  /**
   * Observe a list of Array items.
   */
  observeArray (items: Array<any>) {
    for (let i = 0, l = items.length; i < l; i++) {
      observe(items[i])
    }
  }
}
```

​		真正将数据对象转换成响应式数据的就是Observer构造函数。可以清晰的看到，在Observer这个类中，有三个实例属性：value, dep, vmCount。以及两个实例方法：walk和observeArray。Observer的构造函数接收一个参数，即需要被观测的数据对象。

___

### `__ob__`属性

​		先看Observer的构造函数：

```js
constructor (value: any) {
  this.value = value
  this.dep = new Dep()
  this.vmCount = 0
  def(value, '__ob__', this)
  if (Array.isArray(value)) {
    if (hasProto) {
      protoAugment(value, arrayMethods)
    } else {
      copyAugment(value, arrayMethods, arrayKeys)
    }
    this.observeArray(value)
  } else {
    this.walk(value)
  }
}
```

​		首先将传进来的value数据对象赋值给Observer的实例属性value。接着为实例属性dep赋值一个新创建的Dep对象，这个Dep就是一个收集依赖的“筐”。然后实例属性vmCount被设置为0。

​		接着执行def函数，为数据对象定义一个`__ob__`属性，这个属性就是当前Observer实例对象。而这个def函数就是Object.defineProperty函数的简单封装，之所以这里使用def函数定义`__ob__`属性是因为希望把`__ob__`属性定义成不可枚举的属性，这样以后我们遍历那个数据对象的时候就不会遍历到`__ob__`这个属性。

​		假设我们的数据对象如下：

```js
const data = {
  a: 1
}
```

​		那么经过 `def` 函数处理之后，`data` 对象应该变成如下这个样子：

```js
const data = {
  a: 1,
  // __ob__ 是不可枚举的属性
  __ob__: {
    value: data, // value 属性指向 data 数据对象本身，这是一个循环引用
    dep: dep实例对象, // new Dep()
    vmCount: 0
  }
}
```

___

### 响应式数据之纯对象的处理

​		接着进入一个if else判断分支：

```js
if (Array.isArray(value)) {
  if (hasProto) {
    protoAugment(value, arrayMethods)
  } else {
    copyAugment(value, arrayMethods, arrayKeys)
  }
  this.observeArray(value)
} else {
  this.walk(value)
}
```

​		因为我们在执行observe函数时已经判断过了这个数据的类型，其中一个条件就是这个数据是数组或者是纯对象，所以在Observer的构造函数中的这个数据只能是纯对象或者是数组。

​		我们先看是纯对象的情况，走else分支：

```
this.walk(value)
```

​		找到walk的具体实现：

```js
/**
 * Walk through all properties and convert them into
 * getter/setters. This method should only be called when
 * value type is Object.
 */
walk (obj: Object) {
  const keys = Object.keys(obj)
  for (let i = 0; i < keys.length; i++) {
    defineReactive(obj, keys[i])
  }
}
```

​		这个方法很简单，首先使用Object.keys(obj)方法获取obj上所有可枚举的属性，然后遍历这些属性，为每个属性调用defineReactive方法，并且将obj和这个属性名传进去。我们顺腾摸瓜，继续看看defineReactive的具体实现：

____

### defineReactive函数

```js
/**
 * Define a reactive property on an Object.
 */
export function defineReactive (
  obj: Object,
  key: string,
  val: any,
  customSetter?: ?Function,
  shallow?: boolean
) {
  const dep = new Dep()

  const property = Object.getOwnPropertyDescriptor(obj, key)
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  const getter = property && property.get
  const setter = property && property.set
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key]
  }

  let childOb = !shallow && observe(val)
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      const value = getter ? getter.call(obj) : val
      if (Dep.target) {
        dep.depend()
        if (childOb) {
          childOb.dep.depend()
          if (Array.isArray(value)) {
            dependArray(value)
          }
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      const value = getter ? getter.call(obj) : val
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if (process.env.NODE_ENV !== 'production' && customSetter) {
        customSetter()
      }
      // #7981: for accessor properties without setter
      if (getter && !setter) return
      if (setter) {
        setter.call(obj, newVal)
      } else {
        val = newVal
      }
      childOb = !shallow && observe(newVal)
      dep.notify()
    }
  })
}
```

​		defineReactive函数的核心就是将数据对象的数据属性转换为访问器属性，即为数据对象的属性设置一对getter/setter，但其中做了很多处理边界条件的工作。defineReactive函数接收五个参数，但是在walk中调用defineReactive时只传入了前两个参数，即数据对象和属性的键名。

​		defineReactive首先定义了dep常量，它是一个Dep实例对象：

```js
const dep = new Dep()
```

​		我们在分析`Observer` 的 `constructor` 方法时看到过，在 `constructor` 方法中为数据对象定义了一个 `__ob__` 属性，该属性是一个 `Observer` 实例对象，且该对象包含一个 `Dep` 实例对象：

```js
const data = {
  a: 1,
  __ob__: {
    value: data,
    dep: dep实例对象, // new Dep() , 包含 Dep 实例对象
    vmCount: 0
  }
}
```

​		但`__ob__.dep` 这个 `Dep` 实例对象的作用一样，在defineReactive中的这个dep才是真正用于依赖收集的。

​		另外可以发现这个dep常量被访问器属性的 `getter/setter` 中被闭包引用。所以对于每一个数据对象上的属性它都通过闭包引用着属于自己的dep常量。

​		因为在 `walk` 函数中通过循环遍历了所有数据对象的属性，并调用 `defineReactive` 函数，所以每次调用 `defineReactive` 定义访问器属性时，该属性的 `setter/getter` 都闭包引用了一个属于自己的“筐”。假设我们有如下数据字段：

```js
const data = {
  a: 1,
  b: 2
}
```

​		那么字段 `data.a` 和 `data.b` 都将通过闭包引用属于自己的 `Dep` 实例对象，每个字段的 `Dep` 对象都被用来收集那些属于对应字段的依赖。

​		在定义 `dep` 常量之后，是这样一段代码：

```js
const property = Object.getOwnPropertyDescriptor(obj, key)
if (property && property.configurable === false) {
  return
}
```

​		首先通过 `Object.getOwnPropertyDescriptor` 函数获取该字段可能已有的属性描述对象，并将该对象保存在 `property` 常量中，接着是一个 `if` 语句块，判断该字段是否是可配置的，如果不可配置(`property.configurable === false`)，那么直接 `return` ，即不会继续执行 `defineReactive` 函数。这么做也是合理的，因为一个不可配置的属性是不能使用也没必要使用 `Object.defineProperty` 改变其属性定义的。

​		再往下是这样一段代码：

```js
// cater for pre-defined getter/setters
const getter = property && property.get
const setter = property && property.set
if ((!getter || setter) && arguments.length === 2) {
  val = obj[key]
}

let childOb = !shallow && observe(val)
```

​		这段代码的前两句定义了 `getter` 和 `setter` 常量，分别保存了来自 `property` 对象的 `get` 和 `set` 函数，我们知道 `property` 对象是属性的描述对象，一个对象的属性很可能已经是一个访问器属性了，所以该属性很可能已经存在 `get` 或 `set` 方法。由于接下来会使用 `Object.defineProperty` 函数重新定义属性的 `setter/getter`，这会导致属性原有的 `set` 和 `get` 方法被覆盖，所以要将属性原有的 `setter/getter` 缓存，并在重新定义的 `set` 和 `get` 方法中调用缓存的函数，从而做到不影响属性的原有读写操作。

​		上面这段代码中比较难理解的是 `if` 条件语句：

```js
(!getter || setter) && arguments.length === 2
```

​		其中 `arguments.length === 2` 这个条件好理解，当只传递两个参数时，说明没有传递第三个参数 `val`，那么此时需要根据 `key` 主动去对象上获取相应的值，即执行 `if` 语句块内的代码：`val = obj[key]`。那么 `(!getter || setter)` 这个条件的意思是什么呢？要理解这个条件我们需要思考一些实际应用的场景，或者说边界条件，但是现在还不适合具体分析，我们等到看完整个 `defineReactive` 函数之后，再回头来分析。

​		在 `if` 语句块的下面，是这句代码：

```js
let childOb = !shallow && observe(val)
```

​		定义了 `childOb` 变量，我们知道，在 `if` 语句块里面，获取到了对象属性的值 `val`，但是 `val` 本身有可能也是一个对象，那么此时应该继续调用 `observe(val)` 函数观测该对象从而深度观测数据对象。但前提是 `defineReactive` 函数的最后一个参数 `shallow` 应该是假，即 `!shallow` 为真时才会继续调用 `observe` 函数深度观测，由于在 `walk` 函数中调用 `defineReactive` 函数时没有传递 `shallow` 参数，所以该参数是 `undefined`，那么也就是说默认就是深度观测。其实非深度观测的场景我们早就遇到过了，即 `initRender` 函数中在 `Vue` 实例对象上定义 `$attrs` 属性和 `$listeners` 属性时就是非深度观测，如下：

```js
defineReactive(vm, '$attrs', parentData && parentData.attrs || emptyObject, null, true) // 最后一个参数 shallow 为 true
defineReactive(vm, '$listeners', options._parentListeners || emptyObject, null, true)
```

​		注意一个问题，即使用 `observe(val)` 深度观测数据对象时，这里的 `val` 未必有值，因为必须在满足条件 `(!getter || setter) && arguments.length === 2` 时，才会触发取值的动作：`val = obj[key]`，所以一旦不满足条件即使属性是有值的但是由于没有触发取值的动作，所以 `val` 依然是 `undefined`。这就会导致深度观测无效。



___

### 被观测后的数据对象的样子

​		现在我们需要明确一件事情，那就是一个数据对象经过了 `observe` 函数处理之后变成了什么样子，假设我们有如下数据对象：

```js
const data = {
  a: {
    b: 1
  }
}

observe(data)
```

​		经过 `observe` 处理之后， `data` 和 `data.a` 这两个对象都被定义了 `__ob__` 属性，并且访问器属性 `a` 和 `b` 的 `setter/getter` 都通过闭包引用着属于自己的 `Dep` 实例对象和 `childOb` 对象：

```js
const data = {
  // 属性 a 通过 setter/getter 通过闭包引用着 dep 和 childOb
  a: {
    // 属性 b 通过 setter/getter 通过闭包引用着 dep 和 childOb
    b: 1
    __ob__: {a, dep, vmCount}
  }
  __ob__: {data, dep, vmCount}
}
```

​		需要注意的是，属性 `a` 闭包引用的 `childOb` 实际上就是 `data.a.__ob__`。而属性 `b` 闭包引用的 `childOb` 是 `undefined`，因为属性 `b` 是基本类型值，并不是对象也不是数组。

____

### 在 get 函数中如何收集依赖

我们回过头来继续查看 `defineReactive` 函数的代码，接下来是 `defineReactive` 函数的关键代码，即使用 `Object.defineProperty` 函数定义访问器属性：

```js
Object.defineProperty(obj, key, {
  enumerable: true,
  configurable: true,
  get: function reactiveGetter () {
    // 省略...
  },
  set: function reactiveSetter (newVal) {
    // 省略...
})
```

​		当执行完以上代码实际上 `defineReactive` 函数就执行完毕了，对于访问器属性的 `get` 和 `set` 函数是不会执行的，因为此时没有触发属性的读取和设置操作。不过这不妨碍我们研究一下在 `get` 和 `set` 函数中都做了哪些事情，这里面就包含了我们在前面埋下伏笔的 `if` 条件语句的答案。我们先从 `get` 函数开始，看一看当属性被读取的时候都做了哪些事情，`get` 函数如下：

```js
get: function reactiveGetter () {
  const value = getter ? getter.call(obj) : val
  if (Dep.target) {
    dep.depend()
    if (childOb) {
      childOb.dep.depend()
      if (Array.isArray(value)) {
        dependArray(value)
      }
    }
  }
  return value
}
```

​		既然是 `getter`，那么当然要能够正确地返回属性的值才行，我们知道依赖的收集时机就是属性被读取的时候，所以 `get` 函数做了两件事：正确地返回属性值以及收集依赖，我们具体看一下代码，`get` 函数的第一句代码如下：

```js
const value = getter ? getter.call(obj) : val
```

​		首先判断是否存在 `getter`，我们知道 `getter` 常量中保存的是属性原有的 `get` 函数，如果 `getter` 存在那么直接调用该函数，并以该函数的返回值作为属性的值，保证属性的原有读取操作正常运作。如果 `getter` 不存在则使用 `val` 作为属性的值。可以发现 `get` 函数的最后一句将 `value` 常量返回，这样 `get` 函数需要做的第一件事就完成了，即正确地返回属性值。

​		除了正确地返回属性值，还要收集依赖，而处于 `get` 函数第一行和最后一行代码中间的所有代码都是用来完成收集依赖这件事儿的，下面我们就看一下它是如何收集依赖的，由于我们还没有讲解过 `Dep` 这个类，所以现在大家可以简单的认为 `dep.depend()` 这句代码的执行就意味着依赖被收集了。接下来我们仔细看一下代码：

```js
if (Dep.target) {
  dep.depend()
  if (childOb) {
    childOb.dep.depend()
    if (Array.isArray(value)) {
      dependArray(value)
    }
  }
}
```

​		首先判断 `Dep.target` 是否存在。 `Dep.target` 中保存的值就是要被收集的依赖(观察者)，所以如果 `Dep.target` 存在的话说明有依赖需要被收集，这个时候才需要执行 `if` 语句块内的代码。

​		在 `if` 语句块内第一句执行的代码就是：`dep.depend()`，执行 `dep` 对象的 `depend` 方法将依赖收集到 `dep` 这个“筐”中，这里的 `dep` 对象就是属性的 `getter/setter` 通过闭包引用的“筐”。

​		接着又判断了 `childOb` 是否存在，如果存在那么就执行 `childOb.dep.depend()`。根据前面的代码，比如data上有属性a，我们可以分析出这个`childOb.dep  === a.__ob__.dep`。也就是说 `childOb.dep.depend()` 这句话的执行说明除了要将依赖收集到属性 `a` 自己的“筐”里之外，还要将同样的依赖收集到 `data.a.__ob__.dep` 这里”筐“里，为什么要将同样的依赖分别收集到这两个不同的”筐“里呢？其实答案就在于这两个”筐“里收集的依赖的触发时机是不同的，即作用不同，两个”筐“如下：

- 第一个”筐“是 `dep`

- 第二个”筐“是 `childOb.dep`

  

​		第一个”筐“里收集的依赖的触发时机是当属性值被修改时触发，即在 `set` 函数中触发：`dep.notify()`。而第二个”筐“里收集的依赖的触发时机是在使用 `$set` 或 `Vue.set` 给数据对象添加新属性时触发，我们知道由于 `js` 语言的限制，在没有 `Proxy` 之前 `Vue` 没办法拦截到给对象添加属性的操作。所以 `Vue` 才提供了 `$set` 和 `Vue.set` 等方法让我们有能力给对象添加新属性的同时触发依赖，那么触发依赖是怎么做到的呢？就是通过数据对象的 `__ob__` 属性做到的。因为 `__ob__.dep` 这个”筐“里收集了与 `dep` 这个”筐“同样的依赖。假设 `Vue.set` 函数代码如下：

```js
Vue.set = function (obj, key, val) {
  defineReactive(obj, key, val)
  obj.__ob__.dep.notify()
}
```

​		如上代码所示，当我们使用上面的代码给 `data.a` 对象添加新的属性：

```js
Vue.set(data.a, 'c', 1)
```

​		上面的代码之所以能够触发依赖，就是因为 `Vue.set` 函数中触发了收集在 `data.a.__ob__.dep` 这个”筐“中的依赖：

```js
Vue.set = function (obj, key, val) {
  defineReactive(obj, key, val)
  obj.__ob__.dep.notify() // 相当于 data.a.__ob__.dep.notify()
}

Vue.set(data.a, 'c', 1)
```

​		所以 `__ob__` 属性以及 `__ob__.dep` 的主要作用是为了添加、删除属性时有能力触发依赖，而这就是 `Vue.set` 或 `Vue.delete` 的原理。

在 `childOb.dep.depend()` 这句话的下面还有一个 `if` 条件语句，如下：

```js
if (Array.isArray(value)) {
  dependArray(value)
}
```

​		如果读取的属性值是数组，那么需要调用 `dependArray` 函数逐个触发数组每个元素的依赖收集，为什么这么做呢？那是因为 `Observer` 类在定义响应式属性时对于纯对象和数组的处理方式是不同，对于上面这段 `if` 语句的目的等到我们讲解到对于数组的处理时，会详细说明。

___

### 在set函数中如何触发依赖

在 `get` 函数中收集了依赖之后，接下来我们就要看一下在 `set` 函数中是如何触发依赖的，即当属性被修改的时候如何触发依赖。`set` 函数如下：

```js
set: function reactiveSetter (newVal) {
  const value = getter ? getter.call(obj) : val
  /* eslint-disable no-self-compare */
  if (newVal === value || (newVal !== newVal && value !== value)) {
    return
  }
  /* eslint-enable no-self-compare */
  if (process.env.NODE_ENV !== 'production' && customSetter) {
    customSetter()
  }
  if (setter) {
    setter.call(obj, newVal)
  } else {
    val = newVal
  }
  childOb = !shallow && observe(newVal)
  dep.notify()
}
```

我们知道 `get` 函数主要完成了两部分重要的工作，一个是返回正确的属性值，另一个是收集依赖。与 `get` 函数类似， `set` 函数也要完成两个重要的事情，第一正确地为属性设置新值，第二是能够触发相应的依赖。

首先 `set` 函数接收一个参数 `newVal`，即该属性被设置的新值。在函数体内，先执行了这样一句话：

```js
const value = getter ? getter.call(obj) : val
```

这句话与 `get` 函数体的第一句话相同，即取得属性原有的值，为什么要取得属性原来的值呢？很简单，因为我们需要拿到原有的值与新的值作比较，并且只有在原有值与新设置的值不相等的情况下才需要触发依赖和重新设置属性值，否则意味着属性值并没有改变，当然不需要做额外的处理。如下代码：

```js
/* eslint-disable no-self-compare */
if (newVal === value || (newVal !== newVal && value !== value)) {
  return
}
```

这里就对比了新值和旧值：`newVal === value`。如果新旧值全等，那么函数直接 `return`，不做任何处理。但是除了对比新旧值之外，我们还注意到，另外一个条件：

```js
(newVal !== newVal && value !== value)
```

如果满足该条件，同样不做任何处理，那么这个条件什么意思呢？`newVal !== newVal` 说明新值与新值自身都不全等，同时旧值与旧值自身也不全等，大家想一下在 `js` 中什么时候会出现一个值与自身都不全等的？答案就是 `NaN`：

```js
NaN === NaN // false
```

所以我们现在重新分析一下这个条件，首先 `value !== value` 成立那说明该属性的原有值就是 `NaN`，同时 `newVal !== newVal` 说明为该属性设置的新值也是 `NaN`，所以这个时候新旧值都是 `NaN`，等价于属性的值没有变化，所以自然不需要做额外的处理了，`set` 函数直接 `return` 。

再往下又是一个 `if` 语句块：

```js
/* eslint-enable no-self-compare */
if (process.env.NODE_ENV !== 'production' && customSetter) {
  customSetter()
}
```

上面这段代码的作用是，如果 `customSetter` 函数存在，那么在非生产环境下执行 `customSetter` 函数。其中 `customSetter` 函数是 `defineReactive` 函数的第四个参数。那么 `customSetter` 函数的作用是什么呢？其实我们在讲解 `initRender` 函数的时候就讲解过 `customSetter` 的作用，如下是 `initRender` 函数中的一段代码：

```js
defineReactive(vm, '$attrs', parentData && parentData.attrs || emptyObject, () => {
  !isUpdatingChildComponent && warn(`$attrs is readonly.`, vm)
}, true)
```

上面的代码中使用 `defineReactive` 在 `Vue` 实例对象 `vm` 上定义了 `$attrs` 属性，可以看到传递给 `defineReactive` 函数的第四个参数是一个箭头函数，这个函数就是 `customSetter`，这个箭头函数的作用是当你尝试修改 `vm.$attrs` 属性的值时，打印一段信息：**`$attrs` 属性是只读的**。这就是 `customSetter` 函数的作用，用来打印辅助信息，当然除此之外你可以将 `customSetter` 用在任何适合使用它的地方。

我们回到 `set` 函数，再往下是这样一段代码：

```js
if (setter) {
  setter.call(obj, newVal)
} else {
  val = newVal
}
```

上面这段代码的意图很明显，即正确地设置属性值，首先判断 `setter` 是否存在，我们知道 `setter` 常量存储的是属性原有的 `set` 函数。即如果属性原来拥有自身的 `set` 函数，那么应该继续使用该函数来设置属性的值，从而保证属性原有的设置操作不受影响。如果属性原本就没有 `set` 函数，那么就设置 `val` 的值：`val = newVal`。

接下来就是 `set` 函数的最后两句代码，如下：

```js
childOb = !shallow && observe(newVal)
dep.notify()
```

我们知道，由于属性被设置了新的值，那么假如我们为属性设置的新值是一个数组或者纯对象，那么该数组或纯对象是未被观测的，所以需要对新值进行观测，这就是第一句代码的作用，同时使用新的观测对象重写 `childOb` 的值。当然了，这些操作都是在 `!shallow` 为真的情况下，即需要深度观测的时候才会执行。最后是时候触发依赖了，我们知道 `dep` 是属性用来收集依赖的”筐“，现在我们需要把”筐“里的依赖都执行一下，而这就是 `dep.notify()` 的作用。

至此 `set` 函数我们就分析完毕了。

### 

