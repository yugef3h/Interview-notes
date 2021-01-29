import { ShapeFlags, isString, isObject, isArray } from '../shared/utils'

export function createVNode(type, props = {}, children = null) {
  console.log('创建vnode')
  const shapeFlag = isString(type) ? ShapeFlags.ELEMENT :
    isObject(type) ? ShapeFlags.STATEFUL_COMPONENT : 0

  const vnode = {
    type,
    props,
    children,
    component: null,// 组件实例
    el: null,// vnode和真实dom映射关系
    key: props.key,
    shapeFlag, // vnode类型
  }
  if (isArray(children)) {
    vnode.shapeFlag |= ShapeFlags.ARRAY_CHILDREN;
  } else {
    vnode.shapeFlag |= ShapeFlags.TEXT_CHILDREN;
  }
  return vnode;
}