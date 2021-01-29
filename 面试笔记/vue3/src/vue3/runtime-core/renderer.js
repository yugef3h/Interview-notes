import { createApp } from './createApp'
import { ShapeFlags } from '../shared/utils'
import { createComponentInstance, setupComponent } from './component'
import { effect } from '../reactivity'

export function createRenderer(options) {
  console.log(options)
  return baseCreateRenderer(options)
}

function baseCreateRenderer(options) {
  const {
    createElement: hostCreateElement,
    patchProp: hostPatchProp,
    setElementText: hostSetElementText,
    insetElement: hostInsert,
    removeChild: hostRemove
  } = options

  const mountElement = (vnode, container, anchor) => {
    let { shapeFlag, props } = vnode
    let el = vnode.el = hostCreateElement(vnode.type);
    // 创建子孙节点
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      hostSetElementText(el, vnode.children)
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      mountChildren(vnode.children, el)
    }
    if (props) {
      // 添加属性
      for (let key in props) {
        hostPatchProp(el, key, null, props[key])
      }
    }
    hostInsert(el, container, anchor)
  }

  const mountChildren = (children, container) => {
    for (let i = 0; i < children.length; i++) {
      patch(null, children[i], container)
    }
  }

  const patchProps = (oldProps, newProps, el) => {
    if (oldProps !== newProps) {
      // 新属性覆盖老属性
      for (let key in newProps) {
        const prev = oldProps[key],
          next = newProps[key];
        if (prev !== next) {
          hostPatchProp(el, key, prev, next)
        }
      }
      // 老得有属性，新的没有,需要删除属性
      for (let key in oldProps) {
        if (!(key in newProps)) {
          hostPatchProp(el, key, oldProps[key], null)
        }
      }
    }
  }

  const patchKeydChildren = (c1, c2, el) => {
    // 内部优化策略 头尾双指针
    // ab   i=2
    // abcd
    let i = 0;
    let e1 = c1.length - 1,
      e2 = c2.length - 1;
    // 从前往后
    while (i <= e1 && i <= e2) {
      const n1 = c1[i], n2 = c2[i];
      if (isSameVnodeType(n1, n2)) {
        patch(n1, n2, el)
      } else {
        break;
      }
      i++;
    }
    // 从后往前
    // abc
    // dabc
    while (i <= e1 && i <= e2) {
      const n1 = c1[e1], n2 = c2[e2];
      if (isSameVnodeType(n1, n2)) {
        patch(n1, n2, el)
      } else {
        break;
      }
      e1--;
      e2--;
    }
    // 只考虑元素新增和删除的情况
    // abc=>abcd (i=3,e1=2,e2=3)   abc=>dabc  (i=0  e1=-1  e2=0)
    // 规律：只要i>e1 新增元素
    if (i > e1) {
      // 新增部分
      if (i <= e2) {
        // 根据e2的下一个元素和数组长度比较
        const nextPos = e2 + 1;
        const anchor = nextPos < c2.length ? c2[nextPos].el : null;
        while (i <= e2) {
          patch(null, c2[i], el, anchor);
          i++;
        }
      }
    } else if (i > e2) {// abcd=>abc  (i=3,e1=3,e2=2) 删除节点
      while (i <= e1) {
        hostRemove(c1[i].el)
        i++;
      }
    } else {
      // 无规律情况
      const s1 = i, s2 = i;
      // 新索引和key的一个映射
      const keyToNewIndexMap = new Map();
      for (let i = s2; i < e2; i++) {
        const nextchild = c2[i];
        keyToNewIndexMap.set(nextchild.key, i);
      }
      console.log(keyToNewIndexMap)
      const toBePatched = e2 - s2 + 1;
      const newIndexToOldMapIndex = new Array(toBePatched).fill(0);
      for (let i = s1; i <= e1; i++) {
        const prevChild = c1[i];
        let newIndex = keyToNewIndexMap.get(prevChild.key);
        if (newIndex == undefined) {
          // 删除
          hostRemove(prevChild.el)
        } else {
          newIndexToOldMapIndex[newIndex - s2] = i + 1;
          patch(prevChild, c2[newIndex], el)
        }
      }

      // 最长增长序列
      const increasingIndexSequence=getSequence(newIndexToOldMapIndex);
      let j=increasingIndexSequence.length-1;

      for (let i = toBePatched - 1; i >= 0; i--) {
        const nextIndex = s2 + i;
        const nextChild = c2[nextIndex];
        const anchor = nextIndex + 1 < c2.length ? c2[nextIndex + 1].el : null;// 当前元素的下一个元素
        if (newIndexToOldMapIndex[i] === 0) {// 这是新元素，直接插入
          patch(null, nextChild, el, anchor)
        } else {
          // 下面方式需要反复移动元素，性能较差，可参考官方优化手段 利用render.ts中的getSequence方法
          // hostInsert(nextChild.el, el, anchor)

          // 按照vue3源码实现
          if(j<0 || i!=increasingIndexSequence[j]){
            hostInsert(nextChild.el, el, anchor)
          }else{
            j--
          }
        }

      }
    }
  }

  const patchChildren = (n1, n2, el) => {
    const c1 = n1.children,
      c2 = n2.children;
    const prevShapeFlag = n1.shapeFlag,
      shapeFlag = n2.shapeFlag;
    // 老节点是文本，新节点也是文本，直接覆盖
    // 老节点是数组，新节点是文本，直接覆盖
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      if (c2 !== c1) {
        hostSetElementText(el, c2)
      }
    } else {
      // 老节点是数组，新节点是数组，前后数组diff
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        console.log('核心diff')
        patchKeydChildren(c1, c2, el)
      } else {
        // 老节点是文本，新节点是数组
        if (prevShapeFlag & ShapeFlags.TEXT_CHILDREN) {
          // 移除老的文本
          hostSetElementText(el, '')
        }
        if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
          // 插入新的数组
          for (let i = 0; i < c2.length; i++) {
            patch(null, c2[i], el)
          }
        }
      }
    }
  }

  const patchElement = (n1, n2, container) => {
    console.log('元素更新')
    let el = (n2.el = n1.el);
    const oldProps = n1.props || {};
    const newProps = n2.props || {};

    patchProps(oldProps, newProps, el);
    patchChildren(n1, n2, el)
  }

  const processElement = (n1, n2, container, anchor) => {
    if (n1 === null) {
      // 初次渲染挂载
      mountElement(n2, container, anchor)
    } else {
      // 更新
      patchElement(n1, n2, container, anchor)
    }
  }

  const processComponent = (n1, n2, container) => {
    if (n1 === null) {
      // 初次渲染挂载
      mountComponent(n2, container)
    } else {
      // 更新
      updateComponent(n1, n2, container)
    }
  }

  // 组件mount
  const mountComponent = (initialVnode, container) => {
    // 步骤：1、创建组件实例。2、找到组件render方法3、执行render
    const instance = initialVnode.component = createComponentInstance(initialVnode);
    setupComponent(instance)
    // 给组件创建一个effect，用于渲染,类似于vue2 中渲染watcher
    setupRenderEffect(instance, initialVnode, container)
  }

  // 组件更新
  const updateComponent = (n1, n2, container) => {
    console.log('组件更新')
  }

  const setupRenderEffect = (instance, initialVnode, container) => {
    effect(function componentEffect() {
      if (!instance.isMounted) {
        // 保存渲染组件结果到subTree
        const subTree = instance.subTree = instance.render();
        patch(null, subTree, container)
        instance.isMounted = true;
      } else {
        // 更新操作
        let prev = instance.subTree;
        let next = instance.render();
        patch(prev, next, container)
      }
    })
  }

  const isSameVnodeType = (n1, n2) => {
    return n1.type === n2.type && n1.key === n2.key;
  }

  const patch = (n1, n2, container, anchor = null) => {
    const { shapeFlag } = n2;

    if (n1) {
      if (isSameVnodeType(n1, n2)) {
        // 节点相同，可以复用
        console.log('复用')
      } else {
        // 节点类型不同
        hostRemove(n1.el);
        n1 = null;
      }
    }

    if (shapeFlag & ShapeFlags.ELEMENT) {
      console.log('元素节点', container)
      processElement(n1, n2, container, anchor)
    } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
      console.log('组件', container)
      processComponent(n1, n2, container)
    }
  }

  const render = (vnode, container) => {
    console.log('渲染器', vnode, container)
    patch(null, vnode, container)
  }

  return {
    createApp: createApp(render)
  }
}

// vue3 源码中实现，packages/runtime-core/src/renderer.ts
// https://en.wikipedia.org/wiki/Longest_increasing_subsequence
function getSequence(arr){
  const p = arr.slice()
  const result = [0]
  let i, j, u, v, c
  const len = arr.length
  for (i = 0; i < len; i++) {
    const arrI = arr[i]
    if (arrI !== 0) {
      j = result[result.length - 1]
      if (arr[j] < arrI) {
        p[i] = j
        result.push(i)
        continue
      }
      u = 0
      v = result.length - 1
      while (u < v) {
        c = ((u + v) / 2) | 0
        if (arr[result[c]] < arrI) {
          u = c + 1
        } else {
          v = c
        }
      }
      if (arrI < arr[result[u]]) {
        if (u > 0) {
          p[i] = result[u - 1]
        }
        result[u] = i
      }
    }
  }
  u = result.length
  v = result[u - 1]
  while (u-- > 0) {
    result[u] = v
    v = p[v]
  }
  return result
}