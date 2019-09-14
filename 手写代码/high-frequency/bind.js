Function.prototype.bind = function(context, ...args) {
  if (typeof this !== 'function') throw new Error('!')
  var self = this
  var fbound = function() {
    self.apply(this instanceof self ? this : context,
    args.concat(Array.prototype.slice.call(arguments)) // 延迟函数的参数
      )
  }
  fbound.prototype = Object.create(self.prototype) // 继承
  return fbound
}