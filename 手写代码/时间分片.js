// 时间切片的核心思想是：如果任务不能在 50ms 内执行完，那么为了不阻塞主线程，这个任务应该让出主线程的控制权，使浏览器可以处理其他任务。让出控制权意味着停止执行当前任务，让浏览器去执行其他任务，随后再回来继续执行没有执行完的任务。

// 所以时间切片的目的是不阻塞主线程，而实现目的的技术手段是将一个长任务拆分成很多个不超过 50ms 的小任务分散在宏任务队列中执行。


// 这几行代码充分利用了事件循环机制以及 Generator 函数的特性。
// 核心思想：将长任务拆成一个个接近 50ms 的宏任务执行。具体是通过 yield 关键字可以将任务暂停执行，从而让出主线程的控制权；通过定时器可以将 “未完成的任务” 重新放在任务队列中继续执行。
function timeSlicing (gen) {
  if (typeof gen === 'function') gen = gen()
  if (!gen || typeof gen.next !== 'function') return
  return function next() {
    const start = performance.now() // 需要基于网页的更精确的时间戳，又叫高精度时间，返回页面浏览上下文第一次被创建的时间，不受时钟偏差与系统时钟调整的影响（即手动更改系统时间不会影响该值），试试 new Date(performance.timeOrigin).toLocaleString()
    let res = null
    do {
      res = gen.next()
    } while(!res.done && performance.now() - start < 25);

    if (res.done) return
    setTimeout(next)
  }
}

// 测试：
timeSlicing(function* () {
  const start = performance.now()
  while (performance.now() - start < 1000) {
    console.log(11)
    yield
  }
  console.log('done!')
})();

// 再次验证 ？
timeSlicing(function* () {
  for (let i = 0; i < 10000; i++) {
    console.log(11)
    yield
  }
  console.log('done!')
})();

