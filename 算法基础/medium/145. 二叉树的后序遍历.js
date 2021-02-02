var postorderTraversal = function(root) {
  if (!root) return []
  // 循环 while
  let res = [], stack = [], p = root, set = new Set()
  while (stack.length || p) {
      // 先左，各种左
      while (p) {
          stack.push(p)
          p = p.left
      }
      let node = stack[stack.length - 1]
      if (node.right && !set.has(node.right)) {
          // 右
          p = node.right
          set.add(node.right)
      } else {
          // 左右都遍历结束最后才中
          res.push(node.val)
          stack.pop()
      } 
      
  }
  return res
};


var traversal = (root) => {
    let res = []
    let postOrder = (root) => {
        if (!root) return []
        if (root.left) postOrder(root.left)
        if (root.right) postOrder(root.right)
        res.push(root.val)
    }
    postOrder(root)
    return res
}