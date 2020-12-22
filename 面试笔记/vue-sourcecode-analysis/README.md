# Vue 源码学习笔记

> 代码解析及简单实现

## Vue 构造函数

- 1.找到入口文件
- 2.找到 Vue 构造函数的原型
- 3.Vue 构造函数的静态属性和方法
- 4.Vue 平台化的包装
- 5.Compiler
- 6.例子索引

## Vue 选项的规范化

- 1.mergeOptions 的三个参数
- 2.检查组件名称是否符合要求
- 3.允许合并另一个实例构造者的选项
- 4.规范化 inject
- 5.规范化 directives

## Vue 选项的合并

- 1.合并阶段
- 2.选项 el、propsData 的合并策略
- 3.选项 Data 的合并策略
- 4.声明周期钩子选项的合并策略
- 5.资源选项的合并策略
- 6.选项 watch 的合并策略
- 7.选项 props、methods、inject、computed、provide 的合并策略
- 8.选项处理总结
- 9.回看 mixins 和 extends

## Vue 初始化

- 1.最终选项 $options
- 2.渲染函数的作用域
- 3.初始化之 initLifecycle
- 4.初始化之 initEvents
- 5.初始化之 initRender
- 6.生命周期钩子的实现方式
- 7.初始化之 initState

## Vue 响应式

- 1.实例对象代理访问数据 data
- 2.observe 工厂函数
- 3.保证定义响应式数据行为的一致性
- 4.响应式数据之数组的处理
- 5.数组的特殊性
- 6.$set/$delete 的实现
- 7.100 行代码响应式简单实现
