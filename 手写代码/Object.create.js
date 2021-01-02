if (typeof Object.create !== 'function') {
  Object.create = function(proto, properties) {
    if (typeof proto !== "object" && typeof proto !== "function") {
      throw new TypeError("Object prototype may only be an Object: " + proto);
    }
    let func = function() {}
    func.prototype = proto
    return new func()
  }
}