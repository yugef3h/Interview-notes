const throttle = (fn, interval) => {
  let flag = true
  return function (...args) {
    if (!flag) return
    flag = false
    setTimeout(() => {
      fn.apply(this, args)
      flag = true
    }, interval)
  }
}

const throttle = function(fn, interval) {
  let last = 0;
  return function (...args) {
    let now = +new Date();
    if(now - last < interval) return;
    last = now;
    fn.apply(this, args)
  }
}


const fn = () => {
  console.log(2)
}

let t = throttle(fn, 2000)
t()
t()
t()
t()

setTimeout(() => {
  t()
}, 3000)