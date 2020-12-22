## 具体从以下几点着手：
- CSR与SSR的对比
- 性能优化
- 自动化部署
- 容灾、降级
- 日志、监控

## 背景/目的

公司目前前后端分离采用的是SPA单页模式，SPA会把所有 JS 整体打包，无法忽视的问题就是文件太大，导致渲染前等待很长时间。特别是网速差的时候，让用户等待白屏结束并非一个很好的体验。

选择 SSR 是为了：
- 更好的搜索引擎优化(SEO)
- 更快的内容到达时间 (time-to-content)

## CSR vs SSR

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1127d23bbb7641639721fb3df897e9b2~tplv-k3u1fbpfcp-watermark.image)

## 技术选型 [Nuxt.js 框架](https://nuxtjs.org/)

挑战：
- 性能：如何进行性能优化，提升QPS，节约服务器资源? 
- 容灾：如何做好容灾处理，实现自动降级？
- 日志：如何接入日志，方便问题定位？ 
- 监控：如何对Node服务进行监控？ 
- 部署：如何打通公司CI/CD流程，实现自动化部署？

## 优化/应对

服务器资源！

虽然Vue SSR渲染速度已经很快，但是由于创建组件实例和虚拟DOM节点的开销，与基于字符串拼接的模板引擎的性能相差很大，在高并发情况下，服务器响应会变慢，极大的影响用户体验，因此必须进行性能优化。

### 启用缓存
- 页面缓存，借助 [lru-cache](https://www.npmjs.com/package/lru-cache)
- 组件缓存，nuxt 可配置
- api 缓存，配置头部字段

### 代码层面
- Promise.all

### 首屏最小化

降级处理：

这里的首屏特指首页 (商品详情页) 第一时间渲染的可视区域范围，将页面结构进行拆分，首屏元素采用SSR，非首屏元素通过CSR；SSR数据需要通过 `asyncData` 方法来获取，CSR数据可以在 `mounted` 中获取。

CSR写法如下：

```html
<client-only>
    客户端渲染dom
</client-only>
```

### 主流页面进行 SSR，减小服务器压力

## 降级

### 监控系统降级

- Node 服务器上启动一个服务，用来监测Node进程的CPU和内存使用率，设定一个阈值，当达到这个阈值时，停止SSR，直接将CSR的入口文件index.html返回，实现降级。
### Nginx 降级策略

例如618，双11等大促期间，我们事先知道流量会很大，可以提前通过修改Nginx配置，将请求转发到静态服务器，返回index.html，切换到CSR。

当偶发性的Node服务器返回5xx错误码，或者Node服务器直接挂了，我们可以通过如下Nginx配置，做到自动切换到CSR，保证用户能正常访问。

```
  location / {
      proxy_pass Node服务器地址;
      proxy_intercept_errors on;
      error_page 408 500 501 502 503 504 =200 @spa_page;  
  }

  location @spa_page {
      rewrite ^/*  /spa/200.html break;
      proxy_pass  静态服务器;
  }
```

指定渲染方式：

在url中增加参数isCsr=true，Nginx层对参数isCsr进行拦截，如果带上该参数，指向CSR，否则指向SSR；这样就可以通过url参数配置来进行页面分流，减轻Node服务器压力。

## CI/CD 自动化部署

## 监控/告警

## 日志

应用上线后，一旦发生异常，第一件事情就是要弄清当时发生了什么，比如用户当时如何操作、数据如何响应等，此时日志信息就给我们提供了第一手资料。因此我们需要接入公司的日志系统。

日志组件基于log4js封装，对接公司的日志中心，在nuxt.config.js中增加：

```js
export default {
  // ...
  modules: [
      "@vivo/nuxt-vivo-logger"
  ],
  vivoLog: {
      logPath:process.env.NODE_ENV === "dev"?"./logs":"/data/logs/",
      logName:'aa.log'
  }
}
// how to use
async asyncData({ $axios,$vivoLog }) {
    try {
      const resData =  await $axios.$get('/api/aaa')
      if (process.server) $vivoLog.info(resData)
    } catch (e) {
      if (process.server) $vivoLog.error(e)
    }
},
```


  