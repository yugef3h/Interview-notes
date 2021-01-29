import { nodeOps } from './nodeOps'
import { createRenderer } from '../runtime-core/index'
import { patchProp } from './patchProp'

const renderOptions = {
  ...nodeOps,
  patchProp
} // dom操作配置

function ensureRenderer() {
  return createRenderer(renderOptions);
}

export function createApp(rootComponent) {
  const app = ensureRenderer().createApp(rootComponent)
  const { mount } = app;
  app.mount = (container) => {
    // 1.挂载时需要先将容器清空
    const cn=document.querySelector(container)
    cn.innerHTML = '';
    mount(cn)
  }

  return app;
}