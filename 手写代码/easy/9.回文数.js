// 跳过



/**
 * 判断一个整数是否是回文数
 * 输入: 121 true
 * 输入: -121 false
 * 输入: 10 false
 */
const _7 = require('./7.整数反转')
var isPalindrome = function(x) {
  if (x < 0 || x < 10) return false
  return _7.reverse(x) === x
}