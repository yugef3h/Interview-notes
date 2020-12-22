var twoSun = function(nums, target) {
  let map = {}
  for (let i=0; i<nums.length; i++) {
    if (map[nums[i]] !== undefined) {
      return [i, map[nums[i]]]
    } else {
      map[target - nums[i]] = i // 以另一个值为 key，存当前值的 idx，将答案联系在一起
    }
  }
}