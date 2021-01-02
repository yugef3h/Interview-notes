const { RawSource } = require("webpack-sources")
module.exports = class BasicPlugin {
  constructor(options) {
    this.options = options
  }
  // 1. webpack 读取配置后先实例化插件
  // 2. apply 作用：webpack 会调用 BasicPlugin 实例的 apply 方法给插件实例传入 compiler 对象
  // 3. 通过 comiler.plugin(eventName, callbackFn) 监听 webpack 广播出来的事件
  apply(compiler) {
    // emit 实践是在向输出目录发送资源之前执行
    // compiler.plugin('compilation', function(compilation, next) { ... ;next() })
    // https://survivejs.com/webpack/extending/plugins/
    // compilation.warnings.push("warning");
    // compilation.errors.push("error");
    const {name} = this.options
    compiler.plugin('emit', (compilation, next) => {
      compilation.assets[name] = new RawSource('demo')
      next()
    })
  }
}


// 项目中上传完 sourceMap 后删除 sourceMap 的插件
const _del = require('del'),
symbols = require('log-symbols'),
chalk = require('chalk'),
pluginName = {
  name: 'clean-source-map-webpack-plugin'
}
class CleanSourceMapWebpackPlugin {
  constructor(options) {
    const defaultOptions = {
      sourceMapPath: [], // sourcemap 的文件位置
      dangerouslyAllowCleanPatternsOutsideProject: false // 是否允许跨文件删除
    }
    this.options = Object.assign(defaultOptions, options)
    this.outputPath = ''
  }
  handleDone() {
    const {
      sourceMapPath,
      dangerouslyAllowCleanPatternsOutsideProject
    } = this.options
    const { outputPath } = this
    try {
      // 调用_del库来删除sourceMap文件
      _del.sync(sourceMapPath.map(item => outputPath + '/' + item), { force: dangerouslyAllowCleanPatternsOutsideProject })
      console.log(symbols.success, chalk.green('clean-ource-map-webpack-plugin: complated'))
    } catch (error) {
      const needsForce = /Cannot delete files\/folders outside the current working directory\./.test(error.message)
      if (needsForce) {
        const message = 'clean-source-map-webpack-plugin: Cannot delete files/folders outside the current working directory. Can be overridden with the `dangerouslyAllowCleanPatternsOutsideProject` option.'
        throw new Error(message)
      }
      throw error
    }
  }
  apply(compiler) {
    // 如果没有获取到输出地址
    if (!compiler.options.output || !compiler.options.output.path) {
      console.warn(symbols.warning, chalk.red('clean-source-map-webpack-plugin: options.output.path not defined. Plugin disabled...'))
      return;
    }
    const { sourceMapPath } = this.options
    // 如果没有获取到sourceMap的相对地址
    if (sourceMapPath.length === 0) {
      console.warn(symbols.warning, chalk.red('clean-source-map-webpack-plugin: please input sourceMapPath. Plugin disabled...'))
      return;
    }
    const { hooks } = compiler
    this.outputPath = compiler.options.output.path
    // 如果是webpack4+
    if (hooks) {
      // 在done的事件钩子中注册删除事件
      hooks.done.tap(pluginName, stats => {
        this.handleDone()
      })
    } else {
      compiler.plugin('done', stats => {
        this.handleDone()
      })
    }
  }
}
module.exports = CleanSourceMapWebpackPlugin


class FileListPlugin {
  apply(compiler) {
    compiler.hooks.emit.tapAsync('FileListPlugin', (compilation, next) => {
      // 输出以下内容
      let filelist = 'In this build:\n\n';
      for (let filename in compilation.assets) {
        filelist += '- ' + filename + '\n';
      }
      // 生成一个 md，插入 webpack 构建结果中
      compilation.assets['filelist.md'] = {
        source: function() {
          return filelist
        },
        size: function() {
          return filelist.length
        }
      }
      next()
    })
  }
}
