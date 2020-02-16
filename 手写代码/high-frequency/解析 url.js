// 如何解析一个 URL，获取 query 和 hash 的参数
// 浏览器端
function urlParse(url, key) {
  var a = document.createElement('a')
  a.href = url
  var result = {
    href: url,
    protocol: a.protocol.replace(':', ''),
    port: a.port,
    query: a.search,
    params: (function(){
      var ret = {}, centArr,
        seg = a.search.replace(/^\?/, '').replace(/^\?/,'').split('&')
      for (i = 0, len = seg.length; i < len; i ++) {
        if (!seg[i]) { continue }
        centArr = seg[i].split('=')
        ret[centArr[0]] = centArr[1]
      }
      return ret
    }()),
    hash: a.hash,
    file: (a.pathname.match(/\/([^\/?#]+)$/i) || [, ''])[1],
    path: a.pathname.replace(/^([^\/])/, '/$1'),
    relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [, ''])[1],
    segments: a.pathname.replace(/^\//, '').split('/')
  }
  a = null
  return key ? result[key] : result
}

// nodejs


// h5
var url = new URL('https://www.baidu.com/')
console.log(url.hash)