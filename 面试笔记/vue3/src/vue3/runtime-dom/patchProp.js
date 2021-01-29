

export function patchProp(el, key, prevValue, nextValue) {
  switch (key) {
    case 'class':
      patchClass(el, nextValue)
      break;
    case 'style':
      patchStyle(el, prevValue, nextValue)
      break;
    default:
      patchAttr(el, key, nextValue)

  }
}

function patchClass(el, value) {
  if (value == null) {
    value = ''
  }
  el.className = value;
}

function patchStyle(el, prev, next) {
  const style = el.style;
  if (!next) {
    el.removeAttribute('style')
  } else {
    for (let key in next) {
      style[key] = next[key]
    }
    if (prev) {
      for (let key in prev) {
        if (next[key] == null) {
          style[key] = ''
        }
      }
    }
  }
}

function patchAttr(el, key, value) {
  if (value == null) {
    el.removeAttribute(key)
  } else {
    el.setAttribute(key, value)
  }
}