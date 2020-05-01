let ary = [1, [2, [3, [4, 5]]], 6];
function flatten(ary) {
  return ary.reduce((pre, cur) => {
    return pre.concat(Array.isArray(cur) ? flatten(cur) : cur)
  }, [])
}
console.log(flatten(ary))