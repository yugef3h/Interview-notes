/**
 * 给定一个整数数组 nums ，找到一个具有最大和的连续子数组（子数组最少包含一个元素），返回其最大和
 * @param {*} nums
 */
var maxSubArray = function(nums) {
  let ans = nums[0], sum = 0
  for (let i=1; i<nums.length; i++) {
    if (sum + nums[i] < nums[i]) {
      sum = nums[i]
    } else {
      sum = ans + nums[i]
    }
    ans = Math.max(sum, ans)
  }
  return ans
}
// [-2, 1, -3, 4, -1, 2, 1, -5, 4]
var maxSubArray = function(nums) {
  if (nums.length === 1) return nums[0]
  let init = cache = nums[0]
  for (let i=1; i<nums.length; i++) {
    if (init + nums[i] > init) {
      init = init + nums[i]
    } else {
      init = nums[i]
    }
    cache = Math.max(init, cache)
  }
  return cache
}