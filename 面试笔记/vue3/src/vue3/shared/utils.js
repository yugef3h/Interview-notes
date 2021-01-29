function isObject(target) {
  return (typeof target === 'object' && target !== null)
}

function hasOwnProperty(target, key) {
  return Object.prototype.hasOwnProperty.call(target, key)
}

function isEqual(newValue, oldValue) {
  return newValue === oldValue
}

const isSymbol = val => typeof val === 'symbol'

const isArray = val => Array.isArray(val)

const isInteger = val => '' + parseInt(val, 10) === val

const isString = val => typeof val === 'string'

const isFunction = val => typeof val === 'function'

export {
  isObject,
  hasOwnProperty,
  isEqual,
  isSymbol,
  isArray,
  isInteger,
  isString,
  isFunction
}

export * from './shapeFlags'