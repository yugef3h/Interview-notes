import { isFunction } from "../shared/utils";

export function createComponentInstance(vnode){
  // 简化版
  const instance={
    type:vnode.type,
    props:{},
    vnode,
    render:null,
    setupState:null,
    isMounted:false, // 默认组件没有挂载
  }
  return instance;
}

export const setupComponent=(instance)=>{
  // 1、属性初始化
  // 2、slot初始化
  // 3、调用setup
  setupStatefulComponent(instance)
}

function setupStatefulComponent(instance){
  const Compoent=instance.type;
  const {setup}=Compoent;
  if(setup){
    const setupResult=setup();
    // 需判断返回值类型
    handleSetupResult(instance,setupResult)
  }
}

function handleSetupResult(instance,setupResult){
  if(isFunction(setupResult)){
    instance.render=setupResult
  }else{
    instance.setupState=setupResult
  }
  finishComponentSetup(instance)
}

function finishComponentSetup(instance){
  const Component=instance.type;
  if(Component.render){
    instance.render=Component.render
  }else if(!instance.render){
    // 用的模版方法，需要调用一个compile(Component.template)将模版编译成render
  }
}