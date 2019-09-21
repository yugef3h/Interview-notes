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
    callbackName = callbackName || Math.random().toString()
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