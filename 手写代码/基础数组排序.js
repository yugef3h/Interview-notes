// 冒泡
function bubbleSort(arr) {
  let len = arr.length
  for (let i=len; i>= 2; i--) { // 排完第 2 个，第一个自动为最小
    for (let j=0; j<i-1; j++) { // 每轮排好，后面的都就绪，自然要缩小范围，只排前面
      if (arr[j] > arr[j+1]) {
        [arr[j], arr[j+1]] = [arr[j+1], arr[j]]
      }
    }
  }
  return arr
}

// 选择排序：遍历自身以后的元素，最小的元素跟自己调换位置
function selectSort(arr) {
  let len = arr.length
  for (let i=0; i<len-1; i++) {
    for (let j=i; j<len; j++) {
      if (arr[j] < arr[i]) {
        [arr[i], arr[j]] = [arr[j], arr[i]]
      }
    }
  }
  return arr
}

// 插入排序: 即将元素到已排序好的数组中
function insertSort(arr) {
  for (let i=1; i<arr.length; i++) { // 从 1 开始，默认 0 为已排序
    for (let j=i; j>0; j--) {
      if (arr[j] < arr[j-1]) {
        [arr[j],arr[j-1]] = [arr[j-1],arr[j]]
      } else {
        break;
      }
    }
  }
  return arr
}