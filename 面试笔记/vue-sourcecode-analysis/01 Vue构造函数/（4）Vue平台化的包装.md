​	现在已经看了两个主要的文件,`core/instance/index.js` 文件以及 `core/index.js` 文件。

​	前者主要作用是定义Vue构造函数并对其原型添加属性和方法，即实例属性和实例方法。后者主要作用是为Vue添加全局API，也就是静态的方法和属性。core目录下的代码都是与平台无关的，所以前面两个都在包含核心的Vue，且是与平台无关的。但Vue是一个Multiplatform的项目（Vue和Weex），不同平台可能会内置不同的组件、指令，或者一些平台特有的功能等等，那么这就需要对 `Vue` 根据不同的平台进行平台化地包装。

​	接下来继续回溯对Vue的引用，准备看`platforms/web/runtime/index.js` 文件。

​	首先是：

![image-20200814180419200](C:\Users\DM\AppData\Roaming\Typora\typora-user-images\image-20200814180419200.png)

​		还记得Vue.config是在initGlobalAPI方法中赋值的，赋值以后的Vue.config长这样：

![image-20200814180529083](C:\Users\DM\AppData\Roaming\Typora\typora-user-images\image-20200814180529083.png)

​		我们可以看到，从 `core/config.js` 文件导出的 `config` 对象，大部分属性都是初始化了一个初始值，并且有些注释比如：

![image-20200814180722394](C:\Users\DM\AppData\Roaming\Typora\typora-user-images\image-20200814180722394.png)

​		意思有些配置属性是与平台相关的，在后面包装平台化时很可能会被覆盖掉。

那么刚刚第一段代码就是去覆盖从core/config.js导出的config对象，具体做了什么可以先不看。



​		接着是这两句代码：

![image-20200814180957498](C:\Users\DM\AppData\Roaming\Typora\typora-user-images\image-20200814180957498.png)

在混合之前，Vue.options长这样：

![image-20200814181204153](C:\Users\DM\AppData\Roaming\Typora\typora-user-images\image-20200814181204153.png)

刚刚这两句就是把platformDirectives和platformComponents的属性混合到Vue.options.directives和Vue.options.components。

也就是把平台的指令和组件添加进来，

platformDirectives:

![image-20200814181354665](C:\Users\DM\AppData\Roaming\Typora\typora-user-images\image-20200814181354665.png)

platformComponents:

![image-20200814181416041](C:\Users\DM\AppData\Roaming\Typora\typora-user-images\image-20200814181416041.png)

extend后Vue.options变成这样：

![image-20200814181551833](C:\Users\DM\AppData\Roaming\Typora\typora-user-images\image-20200814181551833.png)



所以这两句就是为Vue.opstions上添加web平台运行时的特定组件和指令。

____

接下来继续看代码：

![image-20200814181949161](C:\Users\DM\AppData\Roaming\Typora\typora-user-images\image-20200814181949161.png)



首先在 `Vue.prototype` 上添加 `__patch__` 方法，如果在浏览器环境运行的话，这个方法的值为 `patch` 函数，否则是一个空函数 `noop`。patch函数是把vnode渲染成真实dom的方法，由于在服务器端渲染的时候没有DOM，所以不需要执行patch方法。

然后又在 `Vue.prototype` 上添加了 `$mount` 方法，我们暂且不关心 `$mount` 方法的内容和作用。

再往下的一段代码是 `vue-devtools` 的全局钩子，它被包裹在 `setTimeout` 中，最后导出了 `Vue`。



现在我们就看完了 `platforms/web/runtime/index.js` 文件，该文件的作用是对 `Vue` 进行平台化地包装：



- 设置平台化的 `Vue.config`。
- 在 `Vue.options` 上混合了两个指令(`directives`)，分别是 `model` 和 `show`。
- 在 `Vue.options` 上混合了两个组件(`components`)，分别是 `Transition` 和 `TransitionGroup`。
- 在 `Vue.prototype` 上添加了两个方法：`__patch__` 和 `$mount`。