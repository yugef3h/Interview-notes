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
  if(typeof this !== 'function'){
    throw 'caller must be a function'
  }
  let self = arguments[0] || window
  self._fn = this // 谁调用函数，函数的 this 就指向谁
  let arg = [...arguments].slice(1)
  let res = self._fn(...arg)
  Reflect.deleteProperty(self, '_fn') // 删除 _fn 属性
  return res
}

