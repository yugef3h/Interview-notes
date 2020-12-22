// 1.宏任务的回调函数中的错误无法捕获，程序直接报错崩掉。
// 异步宏任务
const task = () => {
  setTimeout(() => {
   throw new Error('async error')
 }, 1000)
}
// 主任务
function main1() {
  try {
    task();
  } catch(e) {
    console.log(e, 'err')
    console.log('continue...')
  }
}



// 2.微任务的回调函数中的错误无法捕获，程序直接报错崩掉。
// 返回一个 promise 对象
const promiseFetch = () => 
  new Promise((reslove) => {
  reslove();
})

function main2() {
  try {
    // 回调函数里抛出错误：then 入栈的时候，main 函数已经出栈了
    // 误解：回调函数无法 try catch ？不全对。
    // 主要是看回调是否在同一次事件循环中，即一个 eventloop tick，根本原因还是同步代码
    promiseFetch().then(() => {
      throw new Error('err')
    })
  } catch(e) {
    console.log(e, 'eeee');
    console.log('continue');
  }
}

// 3.以下两个 try catch 都不能捕获到 error，因为 promise 内部的错误不会冒泡出来，而是被 promise 吃掉了，只有通过 promise.catch 才可以捕获，所以用 Promise 一定要写 catch 啊
function main3() {
  try {
    new Promise(() => {
      throw new Error('promise1 error')
    })
  } catch(e) {
    console.log(e.message);
  }
}

function main4() {
  try {
    Promise.reject('promise2 error');
  } catch(e) {
    console.log(e.message);
  }
}

// 4.promise 内部的无论是 reject 或者 throw new Error，都可以通过 catch 回调捕获
// reject
const p1 = new Promise((reslove, reject) => { // new Promise 是同步哦
  if(1) {
    reject();
  }
});
p1.catch((e) => console.log('p1 error'));
// throw new Error
const p2 = new Promise((reslove, reject) => {
  if(1) {
    throw new Error('p2 error')
  }
});
p2.catch((e) => console.log('p2 error'));

// 5.then 之后的错误只能是在回调函数内部 catch 错误，并 return 出来
function main5() {
  Promise.resolve(true).then(() => {
    try {
      throw new Error('then');
    } catch(e) {
      return e; // return 出来
    }
  }).then(e => console.log(e.message));
}

// 6.用 Promise 捕获异步错误
// 把异步操作用 Promise 包装，通过内部判断，把错误 reject，在外面通过 promise.catch 捕获。
const p3 = () =>  new Promise((reslove, reject) => {
  setTimeout(() => {
    reject('async error');
  })
});

function main6() {
  p3().catch(e => console.log(e));
}
main3();

// 7.async/await 的异常捕获
const fetchFailure = () => new Promise((resolve, reject) => {
  setTimeout(() => {// 模拟请求
    if(1) reject('fetch failure...');
  })
})

async function main7 () {
  try {
    const res = await fetchFailure();
    console.log(res, 'res');
  } catch(e) {
    console.log(e, 'e.message');
  }
}
main7();

// 8.更进一步
const handleTryCatch = (fn: (...args: any[]) => Promise<{}>) => async (...args: any[]) => {
  try {
    return [null, await fn(...args)];
  } catch(e) {
    console.log(e, 'e.messagee');
    return [e];
  }
}
// golang
async function main8 () {
  const [err, res] = await handleTryCatch(fetchFailure)('');
  if(err) {
    console.log(err, 'err');
    return;
  }
  console.log(res, 'res');
}

// 9.三阶函数控制 Error + 装饰器模式
// 学习参考自：https://juejin.cn/post/6844903830409183239



