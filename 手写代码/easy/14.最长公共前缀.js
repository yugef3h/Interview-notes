/**
 * 编写一个函数来查找字符串数组中的最长公共前缀
 * 输入: ["flower","flow","flight"]
 * 输出: "fl"
 * 不存在则返回空字符串
 */
// 思路：以 strs[0] 为标准，与其他分别比较，从第一位 while 到 strs[0] 的 length 
var longestCommonPrefix = function(strs) {
  if (!strs.length) return ''
  let res = strs[0]
  for (let i=1; i<strs.length; i++) {
    let cur = strs[i]
    let j = 0
    while (j < res.length) {
      if (res[j] === cur[j]) {
        j++
      } else {
        res = res.slice(0, j)
        if (res === '') return res
      }
    }
  }
  return res
}