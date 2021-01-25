Function.prototype.call = function(context, ...args) {
  context = context || window
  context.fn = this
  let result = eval('context.fn(...args)')
  delete context.fn
  return result
}
Function.prototype.apply = function(context, args) {
  context = context || window
  context.fn = this
  let result = eval('context.fn(...args)')
  delete context.fn
  return result
}

Function.prototype.mycall = function() {
  if(typeof this !== 'function'){ // this 就是当前调用 mycall 的函数
    throw 'caller must be a function'
  }
  let self = arguments[0] || window
  self._fn = this // 把函数挂在 _fn 下
  let arg = [...arguments].slice(1)
  let res = self._fn(...arg) // 直接执行，其实就是 call
  Reflect.deleteProperty(self, '_fn') // 删除 _fn 属性
  return res
}

