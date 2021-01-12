//  JSONP 为什么可以跨域，当然不仅仅是 script 标签不受同源策略影响，实际上 jsonp 是一种前后端人为约定的解决方案
// 那为什么 jsonp 一般会选用 script 标签呢，因为 script 是 js 执行脚本的标签，返回的内容会直接当做 js 来执行。而且 script 加载的 js 是没有跨域限制的，因为加载的是一个脚本，不是一个 ajax 请求
// 所以 jsonp 的原理是通过 script 的 src 访问服务器的接口地址，因为发送请求的是 script 标签，所以返回来的应该是一段 js 的脚本。这就要求服务器单独来处理这个请求，一般服务器接口会把响应的结果通过函数调用的方式返回，比如说返回的内容是'yd'，那就要返回成 cb('yd')

const jsonp = ({url, params, callbackName}) => {
  // 处理地址
  const generateURL = () => {
    let dataStr = ''
    for (let key in params) {
      dataStr += `${key}=${params[key]}&`
    }
    dataStr += `callback=${callbackName}`
    return `${url}?${dataStr}`
  }
  return new Promise((resolve, reject) => {
    callbackName = callbackName || Math.random().toString().substr(2)
    let scriptEle = document.createElement('script')
    scriptEle.src = generateURL()
    document.body.appendChild(scriptEle)
    // 注册于 window，服务器返回字符串 `${callbackName}(${服务器的数据})`
    window[callbackName] = (data) => {
      resolve(data)
      document.body.removeChild(scriptEle)
    }
  })
}