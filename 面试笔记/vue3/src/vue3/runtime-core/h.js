import { createVNode } from "./vnode";

export function h(type, props = {}, children = null) {
  return createVNode(type,props,children)
}