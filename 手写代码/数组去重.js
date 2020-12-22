// 数组去重可以直接使用 Array.from(new Set(arr))
// 目前最快、数据过滤最佳的方法 Map
// hash 字典，创建一个 obj
function hashUnique(a, b) {
  let arr = a.concat(b)
  let result = []
  let obj = {}
  for (let i of arr) {
      if (!obj[i]) {
          result.push(i)
          obj[i] = 1
      }
  }
  return result
}
// map
Array.prototype.mapUnique = function() {
  // 1
  const newArray = []
  const tmp = new Map()
  for (let i=0; i<this.length; i++) {
    if (!tmp.get(this[i])) {
      tmp.set(this[i], 1)
      newArray.push(this[i])
    }
  }
  return newArray

  // 2
  const tmp = new Map()
  return this.filter(item => {
    return !tmp.has(item) && tmp.set(item, 1)
  })
}

var array = [1, 1, '1', '1'];

function unique(array) {
    var res = [];
    for (var i = 0, arrayLen = array.length; i < arrayLen; i++) {
        for (var j = 0, resLen = res.length; j < resLen; j++ ) {
            if (array[i] === res[j]) {
                break;
            }
        }
        if (j === resLen) {
            res.push(array[i])
        }
    }
    return res;
}

console.log(unique(array)); // [1, "1"]


function uniqueByIndexOf(array) {
  var res = [];
  for (var i = 0, len = array.length; i < len; i++) {
      var current = array[i];
      if (res.indexOf(current) === -1) {
          res.push(current)
      }
  }
  return res;
}