Promise.myAll = function(promiseArr) {
  return new Promise((resolve, reject) => {
    const ans = [];
    let index = 0;
    for (let i = 0; i < promiseArr.length; i++) {
      promiseArr[i]
      .then(res => {
        ans[i] = res;
        index++;
        if (index === promiseArr.length) {
          resolve(ans);
        }
      })
      .catch(err => reject(err));
    }
  })
}



// 2
Promise.all = function (iterator) {  
  let count = 0//用于计数，当等于len时就resolve
  let len = iterator.length
  let res = []//用于存放结果
  return new Promise((resolve,reject) => {
      for(var item of iterator){
          Promise.resolve(item)//先转化为Promise对象
          .then((data) => {
              res[count++] = data
              if(count === len){
                  resolve(res)
              }
          })
          .catch(e => {
              reject(e)
          })
      }
  })
}
var promise1 = Promise.resolve(3);
var promise2 = 42;
var promise3 = new Promise(function(resolve, reject) {
setTimeout(resolve, 100, 'foo');
});

Promise.all([promise1, promise2, promise3]).then(function(values) {
console.log(values);
});