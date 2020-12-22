在entry-runtime-with-compiler.js中，可以看到

![image.png](https://cdn.nlark.com/yuque/0/2020/png/2359237/1597387909653-6ff1e1c3-6781-4437-a843-0ea753930c11.png)

再向上找这个引入的Vue：

![image.png](https://cdn.nlark.com/yuque/0/2020/png/2359237/1597387946549-ec639886-5436-4c95-9cf0-078afdaa017e.png)

再向上找这个引入的Vue：
![image.png](https://cdn.nlark.com/yuque/0/2020/png/2359237/1597387984120-fa44ed52-e8c6-40cf-9bcc-9a97bf922bc0.png)

再向上找这个引入的Vue：

![image.png](https://cdn.nlark.com/yuque/0/2020/png/2359237/1597388048054-b454b872-ca63-4be2-8895-2b61cd82d703.png)

终于找到了Vue的最初始声明及定义。

可以看到这里是通过构造函数的方式定义Vue这个对象的。



一般来说，在我们的main.js中new Vue()时就是调用这个构造函数进行创建一个Vue实例。![image.png](https://cdn.nlark.com/yuque/0/2020/png/2359237/1597388131424-e1705f61-2043-492a-a647-047791ec4582.png)创建实例时就开始进行一系列的初始化操作了。而这个_init方法是哪里来的呢？

声明Vue的下面还有一些初始化的操作：![image.png](https://cdn.nlark.com/yuque/0/2020/png/2359237/1597388377205-5c8f1321-cf92-4ce5-b9c9-df3fbadf675f.png)

可以一个个看这些方法都做了些什么事情：

___

### initMixin



首先打开initMixin

可以看到_init方法就是从这个initMixin中绑定到Vue的原型上的：

![image-20200814152846248](C:\Users\DM\AppData\Roaming\Typora\typora-user-images\image-20200814152846248.png)

____

### stateMixin

再看看stateMixin，

主要做了这么几件事，在Vue.prototype上定义了两个属性$data和$props以及$set和$delete方法和$watch方法

![image-20200814153945360](C:\Users\DM\AppData\Roaming\Typora\typora-user-images\image-20200814153945360.png)

还可以看出，$data和$prop代理的是 _data和  _props:

![image-20200814154358142](C:\Users\DM\AppData\Roaming\Typora\typora-user-images\image-20200814154358142.png)

并且在开发环境下这两个是只读属性：

![image-20200814154521072](C:\Users\DM\AppData\Roaming\Typora\typora-user-images\image-20200814154521072.png)

___

### eventsMixin

在Vue.prototype上绑定了四个方法：

![image-20200814154931136](C:\Users\DM\AppData\Roaming\Typora\typora-user-images\image-20200814154931136.png)

___

### lifecycleMixin

在Vue.prototype上绑定了三个方法：

![image-20200814160122399](C:\Users\DM\AppData\Roaming\Typora\typora-user-images\image-20200814160122399.png)

___

### renderMixin

![image-20200814160249943](C:\Users\DM\AppData\Roaming\Typora\typora-user-images\image-20200814160249943.png)

installRenderHelpers在Vue.prototype上绑定了一些辅助函数

![image-20200814160424816](C:\Users\DM\AppData\Roaming\Typora\typora-user-images\image-20200814160424816.png)

然后绑定了$nextTick和_render这两个方法

____

至此，instance/index.js文件中的代码就运行完毕了。可以看出大概就是在每个*Mixin方法中包装Vue.prototype，在上面挂载一些属性和方法，整理以后大概就是下图：

![image-20200814160919264](C:\Users\DM\AppData\Roaming\Typora\typora-user-images\image-20200814160919264.png)