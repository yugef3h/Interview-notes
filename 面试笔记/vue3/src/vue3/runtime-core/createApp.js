import {createVNode} from './vnode'

export function createApp(render) {
  return (rootComponent) => {
    const app = {
      mount(container) {
        console.log('平台无关mount', container)
        const vnode=createVNode(rootComponent)
        render(vnode,container)
      }
    }
    return app;
  }
}