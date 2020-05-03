// node 的回调函数机制，利用 发布-订阅 模式
function EventEmitter() {
  this.events = new Map();
}

// 需要实现的一些方法：
// addListener、removeListener、once、removeAllListeners、emit

// 模拟实现addlistener方法
const wrapCallback = (fn, once = false) => ({ callback: fn, once });
EventEmitter.prototype.addListener = function(type, fn, once = false) {
  const hanlder = this.events.get(type);
  if (!hanlder) {
    // 没有type绑定事件
    this.events.set(type, wrapCallback(fn, once));
  } else if (hanlder && typeof hanlder.callback === 'function') {
    // 目前type事件只有一个回调
    this.events.set(type, [hanlder, wrapCallback(fn, once)]);
  } else {
    // 目前type事件数>=2
    hanlder.push(wrapCallback(fn, once));
  }
}
// 模拟实现removeListener
EventEmitter.prototype.removeListener = function(type, listener) {
  const hanlder = this.events.get(type);
  if (!hanlder) return;
  if (!Array.isArray(this.events)) {
    if (hanlder.callback === listener.callback) this.events.delete(type);
    else return;
  }
  for (let i = 0; i < hanlder.length; i++) {
    const item = hanlder[i];
    if (item.callback === listener.callback) {
      hanlder.splice(i, 1);
      i--;
      if (hanlder.length === 1) {
        this.events.set(type, hanlder[0]);
      }
    }
  }
}
// 模拟实现once方法
EventEmitter.prototype.once = function(type, listener) {
  this.addListener(type, listener, true);
}
// 模拟实现emit方法
EventEmitter.prototype.emit = function(type, ...args) {
  const hanlder = this.events.get(type);
  if (!hanlder) return;
  if (Array.isArray(hanlder)) {
    hanlder.forEach(item => {
      item.callback.apply(this, args);
      if (item.once) {
        this.removeListener(type, item);
      }
    })
  } else {
    hanlder.callback.apply(this, args);
    if (hanlder.once) {
      this.events.delete(type);
    }
  }
  return true;
}
EventEmitter.prototype.removeAllListeners = function(type) {
  const hanlder = this.events.get(type);
  if (!hanlder) return;
  this.events.delete(type);
}
