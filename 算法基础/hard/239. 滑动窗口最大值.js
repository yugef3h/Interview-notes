/**
 * 给定一个数组 nums，有一个大小为 k 的滑动窗口从数组的最左侧移动到数组的最右侧。你只可以看到在滑动窗口内的 k 个数字。滑动窗口每次只向右移动一位。

返回滑动窗口中的最大值，即 k 个数中的 Math.max
输入: nums = [1,3,-1,-3,5,3,6,7], 和 k = 3
输出: [3,3,5,5,6,7] 
 */
// 解题思路：单调队列从高到低，首位只存最大值
var maxSlidingWindow = function(nums, k) {
  let queue = [] // 存下标，不一定满足长度为 k！
  let res = []
  for (let i=0; i<nums.length; i++) {
      if (i - queue[0] >= k) queue.shift() // 假如超过 k 长度就删除首位
      while(nums[queue[queue.length-1]] <= nums[i]) { // 将 queue 的最后一位与当前值比较，小则剔除，始终保持单调队列
          queue.pop()
      }
      queue.push(i) // 存下标
      if (i >= k-1) res.push(nums[queue[0]]) // i 大于等于 k-1 就可以填进数组了
  }
  return res
};
// 方法2会超时

var maxSlidingWindow = function(nums, k) {
  let len = nums.length
  if (len === 0) return []
  let res = []
  for (let i=0; i<len-k+1; i++) {
      let max = Number.MIN_SAFE_INTEGER
      for (let j=i; j<i+k; j++) {
          max = Math.max(max, nums[j])
      }
      res.push(max)
  }
  return res
};