Promise.race = function(promiseArr) {
  return new Promise((resolve, reject) => {
    promiseArr.forEach(p => {
      // 如果不是Promise实例需要转化为Promise实例
      Promise.resolve(p).then(
        val => resolve(val),
        err => reject(err),
      )
    })
  })
}

// 2
Promise.race = function (iterators) {  
  return new Promise((resolve,reject) => {
      for (const p of iterators) {
          Promise.resolve(p)
          .then((res) => {
              resolve(res)
          })
          .catch(e => {
              reject(e)
          })
      }
  })

}
var promise1 = new Promise(function(resolve, reject) {
  setTimeout(resolve, 500, 'one');
});

var promise2 = new Promise(function(resolve, reject) {
  setTimeout(resolve, 100, 'two');
});

Promise.race([promise1, promise2]).then(function(value) {
  console.log(value);
  // Both resolve, but promise2 is faster
});
