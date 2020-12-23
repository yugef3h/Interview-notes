## 项目痛点

当我们使用开发工具构建项目时，需要思考我们的配置能否让我们的项目更快的构建，拥有更小的项目体积，更简洁清晰的项目结构。随着我们的项目越做越大，项目依赖越来越多，项目结构越来越来复杂，项目体积就会越来越大，构建时间越来越长，久而久之就会成了一个又大又重的项目，所以说我们要学会适当的为项目 “减负”，让项目不能输在起跑线上。

## 这里针对公司的 react 老项目进行 webpack 优化分析

为了查看该项目的构建时间，我写了个简单的 `webpack plugin`，记录了 webpack 构建一次 compilation 所用的时间。

```js
const chalk = require('chalk') /* console 颜色 */
var slog = require('single-line-log'); /* 单行打印 console */

class ConsolePlugin {
    constructor(options){
       this.options = options
    }
    apply(compiler){
        /**
         * Monitor file change 记录当前改动文件
         */
        compiler.hooks.watchRun.tap('ConsolePlugin', (watching) => {
            const changeFiles = watching.watchFileSystem.watcher.mtimes
            for(let file in changeFiles){
                console.log(chalk.green('当前改动文件：'+ file))
            }
        })
        /**
         *  before a new compilation is created. 开始 compilation 编译 。
         */
        compiler.hooks.compile.tap('ConsolePlugin',()=>{
            this.beginCompile()
        })
        /**
         * Executed when the compilation has completed. 一次 compilation 完成。
         */
        compiler.hooks.done.tap('ConsolePlugin',()=>{
            this.timer && clearInterval( this.timer )
            const endTime =  new Date().getTime()
            const time = (endTime - this.starTime) / 1000
            console.log( chalk.yellow(' 编译完成') )
            console.log( chalk.yellow('编译用时：' + time + '秒' ) )
        })
    }
    beginCompile(){
       const lineSlog = slog.stdout
       let text  = '开始编译：'
       /* 记录开始时间 */
       this.starTime =  new Date().getTime()
       this.timer = setInterval(()=>{
          text +=  '█'
          lineSlog( chalk.green(text))
       },50)
    }
}
```

旧项目编译用时 28.062 秒，体积 6.7 MB。

### include 或 exclude 限制 loader 范围

```js
{
    test: /\.jsx?$/,
    exclude: /node_modules/,
    include: path.resolve(__dirname, '../src'),
    use:['happypack/loader?id=babel']
    // loader: 'babel-loader'
}
```

### happypack多进程编译

除了上述改动之外，在 plugin 中

```js
/* 多线程编译 */
new HappyPack({
    id:'babel',
    loaders:['babel-loader?cacheDirectory=true']
})
```

### 缓存babel编译过的文件

```js
loaders:['babel-loader?cacheDirectory=true']
```

### tree Shaking 删除冗余代码

### 按需加载，按需引入

关于组件的相关优化，按需加载插件

### antd UI 库瘦身
`.babelrc` 增加对 antd 样式按需引入

```js
["import", {
    "libraryName":
    "antd",
    "libraryDirectory": "es",
    "style": true
}]
```

### 框架部分

相关移步《React优化》


构建时间从 28 秒优化到了 4.89 秒，体积 2.4 M。