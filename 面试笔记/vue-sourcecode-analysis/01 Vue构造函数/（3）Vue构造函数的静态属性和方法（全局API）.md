看完core/instance/index.js中的Vue的出生，接下来回溯到core/index.js中，这个文件将Vue从core/instance/index.js中的Vue导入了进来，看看core/index.js中的代码：

![image-20200814161451672](C:\Users\DM\AppData\Roaming\Typora\typora-user-images\image-20200814161451672.png)

其中 `initGlobalAPI` 是一个函数，并且以 `Vue` 构造函数作为参数进行调用：![image-20200814161610286](C:\Users\DM\AppData\Roaming\Typora\typora-user-images\image-20200814161610286.png)



然后再Vue.proptotype上分别添加两个属性——$isServer和$ssrContext。然后在Vue原型上定义了`FunctionalRenderContext` 静态属性，这个属性是为了在ssr中使用它。



然后是![image-20200814162150118](C:\Users\DM\AppData\Roaming\Typora\typora-user-images\image-20200814162150118.png)

这里其实是一个占位符，在scripts/config.js中的genConfig方法中有一句__ Version __：version，这句话被卸载了rollup的replace插件中，也就是最终这个占位符将被真正的Vue的版本号替换。

而这个version在package.json中定义了

![image-20200814162449797](C:\Users\DM\AppData\Roaming\Typora\typora-user-images\image-20200814162449797.png)

![image-20200814162623212](C:\Users\DM\AppData\Roaming\Typora\typora-user-images\image-20200814162623212.png)

____

再回头看看这个initGlobalAPI(Vue)，这就是在Vue上添加一些全局的静态属性和方法，具体添加了哪些可以看`src/core/global-api/index.js`中的initGlobalAPI方法：



首先是：![image-20200814163137841](C:\Users\DM\AppData\Roaming\Typora\typora-user-images\image-20200814163137841.png)

这段代码就是在Vue构造函数上添加一个config只读属性，那么config的值在core/config.js中导入的一个对象。



接着是：

![image-20200814163540998](C:\Users\DM\AppData\Roaming\Typora\typora-user-images\image-20200814163540998.png)

util对象中的四个属性来自core/util/index.js中。在注释中说到，这四个方法并不是公共的API，尽管可以使用但应该避免依赖它们，因为这四个方法不能够保证在版本的更迭中保持稳定不变。



然后是：

![image-20200814164033253](C:\Users\DM\AppData\Roaming\Typora\typora-user-images\image-20200814164033253.png)

在Vue上添加了 `set`、`delete`、`nextTick` 、`observable`以及 `options`.

然后为options这个空对象添加属性：

![image-20200814164223118](C:\Users\DM\AppData\Roaming\Typora\typora-user-images\image-20200814164223118.png)

找到ASSET_TYPES的定义处：

![image-20200814164316924](C:\Users\DM\AppData\Roaming\Typora\typora-user-images\image-20200814164316924.png)

执行完后将变成这样：

![image-20200814164500838](C:\Users\DM\AppData\Roaming\Typora\typora-user-images\image-20200814164500838.png)

_base就是Vue构造函数，将在以后创建组件的时候用上。



紧接着，是这句代码：

![image-20200814164604756](C:\Users\DM\AppData\Roaming\Typora\typora-user-images\image-20200814164604756.png)

extend就是将第二个入参的属性混合到第一个入参中

![image-20200814164951996](C:\Users\DM\AppData\Roaming\Typora\typora-user-images\image-20200814164951996.png)

这个builtInComponents可以看定义处：

![image-20200814165112796](C:\Users\DM\AppData\Roaming\Typora\typora-user-images\image-20200814165112796.png)

其实就是将内置组件到Vue.options.components中，所以最终 `Vue.options.components` 的值如下：

![image-20200814165204509](C:\Users\DM\AppData\Roaming\Typora\typora-user-images\image-20200814165204509.png)

那么到现在为止，Vue.options已经变成这样了：

![image-20200814165243478](C:\Users\DM\AppData\Roaming\Typora\typora-user-images\image-20200814165243478.png)





继续看initGlobalAPI中的代码：![image-20200814165321995](C:\Users\DM\AppData\Roaming\Typora\typora-user-images\image-20200814165321995.png)

分别看看这四个方法的定义：

### initUse

![image-20200814165445395](C:\Users\DM\AppData\Roaming\Typora\typora-user-images\image-20200814165445395.png)

该方法的作用是在 `Vue` 构造函数上添加 `use` 方法，也就是传说中的 `Vue.use` 这个全局API，这个方法大家应该不会陌生，用来安装 `Vue` 插件。

___

### initMixin

![image-20200814165605885](C:\Users\DM\AppData\Roaming\Typora\typora-user-images\image-20200814165605885.png)

非常清晰的看到Vue上mixin这个全局API的定义

___

### initExtend

![image-20200814165731854](C:\Users\DM\AppData\Roaming\Typora\typora-user-images\image-20200814165731854.png)

`initExtend` 方法在 `Vue` 上添加了 `Vue.cid` 静态属性，和 `Vue.extend` 静态方法。



___

### initAssetRegisters

![image-20200814165948821](C:\Users\DM\AppData\Roaming\Typora\typora-user-images\image-20200814165948821.png)

`ASSET_TYPES` 我们已经见过了，它在 `shared/constants.js` 文件中，长成这样：

![image-20200814170002653](C:\Users\DM\AppData\Roaming\Typora\typora-user-images\image-20200814170002653.png)

所以，最终经过 `initAssetRegisters` 方法，`Vue` 又多了三个静态方法：Vue.component、Vue.directive和Vue.filter。

这三个静态方法都不陌生，分别用来全局注册组件、指令、和过滤器。

___

这样initGlobalAPI这个方法就执行完毕了，可以看出来它就是给Vue构造函数添加全局的API，整理以后就变成这样：



![image-20200814170506288](C:\Users\DM\AppData\Roaming\Typora\typora-user-images\image-20200814170506288.png)