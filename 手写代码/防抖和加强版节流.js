// 防抖
const debounce = (fn, delay) => {
  let timer = null
  return function(...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

// 加强版，无限防抖，固定频率触发
const throttle = (fn, delay) => {
  let timer = null, last = 0 // last = 0 表示首次立即执行
  return function(...args) {
    let now = +new Date()
    if (now - last < delay && timer) {
      clearTimeout(timer)
      timer = setTimeout(() => {
        fn.apply(this, args)
      }, delay)
    } else {
      last = now
      fn.apply(this, args)
    }
  }
}

// 立即执行加强版

const fn = () => {
  console.log(2)
}

let t = debounce(fn, 2000)
t()
t()
t()
t()

setTimeout(() => {
  t()
}, 1000)