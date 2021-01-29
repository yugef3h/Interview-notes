export const nodeOps = {
  createElement(type) {
    return document.createElement(type);
  },
  setElementText(el, text) {
    el.textContent = text;
  },
  insetElement(child, parent, anchor = null) {
    parent.insertBefore(child, anchor); // anchor为null表示appendChild
  },
  removeChild(child) {
    const parent = child.parentNode;
    if (parent) {
      parent.removeChild(child);
    }
  }
}