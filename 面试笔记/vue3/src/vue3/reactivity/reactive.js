import { isObject } from '../shared/utils.js'
import { mutableHandler } from './mutableHandler.js'

function reactive(target){
  return createReactive(target,mutableHandler)
}

const proxyMap = new WeakMap();
function createReactive(target,baseHandler){
  if(!isObject(target)){
    console.error(`target must be a object`)
    return target
  }
  const existingProxy=proxyMap.get(target)
  if(existingProxy){
    return existingProxy
  }
  // 只对最外层对象做代理
  const proxy=new Proxy(target,baseHandler)
  proxyMap.set(target,proxy) // 将代理的对象和代理后的对象做映射
  return proxy;
  // return new Proxy(target,{
  //   get:(target,key,receiver)=>{
  //     Reflect.get(target)
  //   },
  //   set:(target,key,value,receiver)=>{

  //   }
  // })
}

export {
  reactive
}