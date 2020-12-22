exports.a = {
  b: 1
}

module.exports.a = {
  c: 1
}

let obj = {
  name: 'yuql'
}

setTimeout(() => {
  obj = 'yu'
  console.log(1)
}, 2000)

module.exports = obj
console.log(module)