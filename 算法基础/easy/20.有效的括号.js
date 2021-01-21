/**
 * 给定一个只包括 '('，')'，'{'，'}'，'['，']' 的字符串，判断字符串是否有效
 * 必须满足：左括号必须用相同类型的右括号闭合
 * 必须满足：左括号必须以正确的顺序闭合
 * 输入："()[]{}"
 * 输出：true
 */
var isValid = function(s) {
  let stack = []
  for (let i=0; i<s.length; i++) {
    let val = s.charAt(i)
    if (val === '(' || val === '{' || val === '[') {
      stack.push(val)
    }
    if (!stack.length) return false // 空判断
    if (val === ')' && stack.pop() !== '(') return false
    if (val === '}' && stack.pop() !== '{') return false
    if (val === ']' && stack.pop() !== '[') return false
  }
  return stack.length === 0
}