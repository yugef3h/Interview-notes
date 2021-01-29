import { isObject, hasOwnProperty, isEqual, isSymbol, isArray, isInteger } from '../shared/utils.js'
import { reactive } from './reactive'
import { track, trigger } from './effect'

function createGetter() {
  return (target, key, receiver) => {
    const res = Reflect.get(target, key, receiver)
    if (isSymbol(key)) { // 忽略symbol类型,array中有些symbol类型的内置方法
      return res;
    }
    // 依赖收集逻辑
    console.log('响应式获取值', target[key])
    track(target, key);
    if (isObject(res)) {
      // 对计算的值 res 进行判断，如果它也是数组或对象，则递归执行 reactive 把 res 变成响应式对象。
      // 这么做是因为 Proxy 劫持的是对象本身，并不能劫持子对象的变化，这点和 Object.defineProperty API 一致。
      // 但是 Object.defineProperty 是在初始化阶段，即定义劫持对象的时候就已经递归执行了，
      // 而 Proxy 是在对象属性被访问的时候才递归执行下一步 reactive，这其实是一种延时定义子对象响应式的实现，在性能上会有较大的提升。
      return reactive(res)
    }
    return res;
  }
}

function createSetter() {
  return (target, key, value, receiver) => {
    const isKeyExist = (isArray(target) && isInteger(key)) ? Number(key) < target.length : hasOwnProperty(target, key);
    const oldValue = target[key]
    const res = Reflect.set(target, key, value, receiver)
    console.log('响应式设置值' + key + '=' + value)

    if (!isKeyExist) {
      console.log('响应式新增：' + value)
      trigger(target, 'add', key, value)
    } else if (!isEqual(value, oldValue)) {
      console.log('响应式修改：' + value)
      trigger(target, 'set', key, value, oldValue)
    }
    return res;
  }
}

const get = createGetter(),
  set = createSetter();

export const mutableHandler = {
  get,
  set
}