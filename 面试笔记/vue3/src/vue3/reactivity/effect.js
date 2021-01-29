import {isArray,isInteger} from '../shared/utils'
export function effect(fn, options = {}) {
  const effect = createReactiveEffect(fn, options);

  if (!options.lazy) {
    effect()
  }

  return effect;
}

let activeEffect;// 用来存储当前effect
let uid = 0;
const effectStack = []; // 处理嵌套effect
function createReactiveEffect(fn, options) {
  const effect = function () {
    if (!effectStack.includes(activeEffect)) { // 防止递归执行
      try {
        activeEffect = effect;
        effectStack.push(activeEffect)
        return fn();// 用户自己逻辑，可能会对数据进行取值操作
      } finally {
        effectStack.pop();
        activeEffect = effectStack[effectStack.length - 1]
      }
    }
  }
  effect.id = uid++;
  effect.deps = []; // 表示effect中依赖的属性
  effect.options = options;
  return effect
}

// {object:{key:[effect1,effect2,...]}}
const targetMap = new WeakMap();

// 将属性和effect关联起来
export function track(target, key) {
  if (activeEffect == undefined) {
    // 没有任何关联的effect
    return;
  }
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()))
  }
  let dep = depsMap.get(key);
  if (!dep) {
    depsMap.set(key, (dep = new Set()))
  }
  if (!dep.has(activeEffect)) {
    dep.add(activeEffect);
    activeEffect.deps.push(dep); // 保证双向
  }
  console.log(targetMap)
}

/*
 *@Description: 触发更新
 *@param: target 目标对象
 *@param: type 表示新增还是修改
 *@param: key 属性
 *@param: value 新值 不是必传项
 *@param: oldValue 旧值 不是必传项
 *@ClassAuthor: Happy Ma
 *@Date: 2020-10-25 17:59:34
*/
export function trigger(target, type, key, value, oldValue) {
  const depsMap=targetMap.get(target)
  if(!depsMap){
    return;
  }
  const run=effects=>{
    if(effects){
      effects.forEach(effect=>effect())
    }
  }
  // 数组的处理
  if(key==='length' && isArray(target)){
    depsMap.forEach((dep,k)=>{
      if(k==='length' || k>=value){ // 如果改的数组长度小于数组原有长度
        run(dep)
      }
    })
  }else{
    // 对象的处理
    if(key != void 0){ // 说明修改了key，也可以写成undefined  https://www.jianshu.com/p/50c786b91bea
      run(depsMap.get(key))
    }
    switch(type){
      case 'add':
        if(isArray(target)){ // 通过索引增加数据
          if(isInteger(key)){
            run(depsMap.get('length')) // 页面中直接使用数组，也会对数组进行取值操作，对lenth进行收集effect，新增时就可以直接触发更新
          }
        }
        break;
      default:
        break;
    }
  }

}