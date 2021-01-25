function EventEmitter() {
  this.events = new Map();
}
// once 参数表示是否只是触发一次
const wrapCallback = (fn, once = false) => ({ callback: fn, once });

EventEmitter.prototype.addListener = function (type, fn, once = false) {
  let handler = this.events.get(type);
  if (!handler) {
    // 为 type 事件绑定回调
    this.events.set(type, wrapCallback(fn, once));
  } else if (handler && typeof handler.callback === 'function') {
    // 目前 type 事件只有一个回调
    this.events.set(type, [handler, wrapCallback(fn, once)]);
  } else {
    // 目前 type 事件回调数 >= 2
    handler.push(wrapCallback(fn, once));
  }
}
EventEmitter.prototype.removeListener = function (type, listener) {
  let handler = this.events.get(type);
  if (!handler) return;
  if (!Array.isArray(handler)) {
    if (handler.callback === listener.callback) this.events.delete(type);
    else return;
    // return;
  }
  for (let i = 0; i < handler.length; i++) {
    let item = handler[i];
    if (item.callback === listener.callback) {
      // 删除该回调，注意数组塌陷的问题，即后面的元素会往前挪一位。i 要 -- 
      handler.splice(i, 1);
      i--;
      if (handler.length === 1) {
        // 长度为 1 就不用数组存了
        this.events.set(type, handler[0]);
      }
    }
  }
}
EventEmitter.prototype.once = function (type, fn) {
  this.addListener(type, fn, true);
}

EventEmitter.prototype.emit = function (type, ...args) {
  let handler = this.events.get(type);
  if (!handler) return;
  if (Array.isArray(handler)) {
    // 遍历列表，执行回调
    handler.map(item => {
      item.callback.apply(this, args);
      // 标记的 once: true 的项直接移除
      if (item.once) this.removeListener(type, item);
    })
  } else {
    // 只有一个回调则直接执行
    handler.callback.apply(this, args);
  }
  return true;
}

EventEmitter.prototype.removeAllListener = function (type) {
  let handler = this.events.get(type);
  if (!handler) return;
  else this.events.delete(type);
}
let e = new EventEmitter();
e.addListener('type', () => {
  console.log("type事件触发！");
})
e.addListener('type', () => {
  console.log("WOW!type事件又触发了！");
})

function f() { 
  console.log("type事件我只触发一次"); 
}
e.once('type', f)
e.emit('type');
e.emit('type');
e.removeAllListener('type');
e.emit('type');

// type事件触发！
// WOW!type事件又触发了！
// type事件我只触发一次
// type事件触发！
// WOW!type事件又触发了！
