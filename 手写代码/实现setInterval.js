// setInterval(cb, time)
// 待完善的部分：比如setTimeout 的 args 参数、Node 和浏览器端的 setTimeout 差异等等。
// 研究 node 定时器源码解析！
// node 中因为存在大量定时器任务，所以使用双向链表维护 timeId 的插入和移除，先插入的先执行
// [](https://segmentfault.com/a/1190000005082085)
let map = {}, id=0
let mySetInterval = (cb, time) => {
  let timeId = id
  id++
  let fn = () => {
    cb()
    map[timeId] = setTimeout(() => {
      fn()
    }, time)
  }
  map[timeId] = setTimeout(fn, time)
  return timeId
}
let myClearInterval = (timeId) => {
  clearTimeout(map[timeId])
  delete map[timeId]
}

let resId = mySetInterval(() => console.log(new Date()), 1000)

setTimeout(() => {
  myClearInterval(resId)
}, 3000)


