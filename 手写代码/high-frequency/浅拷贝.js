// 1.Object.assgin
// 2....
// 3.concat
// 4.slice

// 5.basic for
const shallowClone = (target) => {
  if (typeof target === 'object' && target !== null) {
    const cloneTarget = Array.isArray(target) ? [] : {}
    for (let prop in target) { // in 虽然可以遍历属性，但可能包括原型链上的属性
      if (target.hasOwnProperty(prop)) { // hasOwnProperty 才是对象本身的属性
        cloneTarget[prop] = target[prop]
      }
    }
    return cloneTarget
  } else {
    return target
  }
}