/**
 * 运用你所掌握的数据结构，设计和实现一个  LRU (最近最少使用) 缓存机制。它应该支持以下操作： 获取数据 get 和 写入数据 put 。

获取数据 get(key) - 如果关键字 (key) 存在于缓存中，则获取关键字的值（总是正数），否则返回 -1。
写入数据 put(key, value) - 如果关键字已经存在，则变更其数据值；如果关键字不存在，则插入该组「关键字/值」。当缓存容量达到上限时，它应该在写入新数据之前删除最久未使用的数据值，从而为新的数据值留出空间
你是否可以在 O(1) 时间复杂度内完成这两种操作？
 */
var LRUCache = function(capacity) {
  this.max = capacity
  this.map = new Map()
}
LRUCache.prototype.get = function(key) {
  // 删除并更新为新
  if (this.map.has(key)) {
    let val = this.map.get(key)
    // 先删后赋值保证长度不会超出
    this.map.delete(key)
    this.map.set(key, val)
    return value
  } else {
    return -1
  }
}
LRUCache.prototype.put = function(key, val) {
  // 先删后赋值保证长度不会超出
  if (this.map.has(key)) {
    this.map.delete(key)
  }
  this.map.set(key, val)
  if (this.map.size > this.max) {
    this.map.delete(this.map.keys().next().value)
  }
}