/**
 * 实现一个批量请求函数 multiRequest(urls, maxNum)，要求如下：
 * • 要求最大并发数 maxNum
 * • 每当有一个请求返回，就留下一个空位，可以增加新的请求
 * • 所有请求完成后，结果按照 urls 里面的顺序依次打出
 */

function multiRequest(urls = [], maxNum) {
  const len = urls.length
  const result = new Array(len).fill(false)
  let count = 0
  return new Promise((resolve, reject) => {
    while(count < maxNum) {
      next()
    }
    function next() {
      let current = count++
      // 结束条件
      if (current >= len) {
        !result.includes(false) && resolve(result)
        return;
      }
      const url = urls[current]
      fetch(url)
        .then(res => {
          result[current] = res
          if (current < len) {
            next()
          }
        })
        .catch(err => {
          result[current] = err
          if (current < len) {
            next()
          }
        })
    }
  })
}