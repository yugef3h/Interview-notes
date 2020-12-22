// 口诀: 插冒归基稳定，快选堆希不稳定
// 数组排序的稳定性：同大小情况下是否可能会被交换位置, 虚拟dom的diff，不稳定性会导致重新渲染


// 快速排序思路
// 选择基准值(base)，原数组长度减一(基准值)，使用 splice
// 循环原数组，小的放左边(left数组)，大的放右边(right数组);
// concat(left, base, right)
// 递归继续排序 left 与 right

function quickSort(arr) {
  if (arr.length <= 1) return arr
  let left = [], right = [], mid = arr.splice(0, 1)
  for (let i=0; i<arr.length; i++) {
    if (arr[i] < mid) {
      left.push(arr[i])
    } else {
      right.push(arr[i])
    }
  }
  return quickSort(left).concat(mid, quickSort(right))
}