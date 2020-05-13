Function.prototype.bind = function(context, ...args) {
  if (typeof this !== 'function') throw new Error('!')
  let self = this
  let fbound = function() {
    self.apply(this instanceof self ? this : context,
    args.concat(Array.prototype.slice.call(arguments)) // 延迟函数的参数
      )
  }
  fbound.prototype = Object.create(self.prototype) // 维护原型继承
  return fbound
}