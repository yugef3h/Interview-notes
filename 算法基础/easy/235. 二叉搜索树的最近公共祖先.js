/**
 * 给定一个二叉搜索树, 找到该树中两个指定节点的最近公共祖先
 * 输入: root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 8
 * 输出: 6
 * 解释: 节点 2 和节点 8 的最近公共祖先是 6
 */
var lowestCommonAncestor = function(root, p, q) {
  let node = root
  // 二叉搜索树的特性本身就是这样，所以简单
  while(node) {
    // 比如 p = 3、 q = 5，而 root.val=6，大于 p 和 q，那么缩小范围，去 root.left 继续比较
    if (node.val > p.val && node.val > q.val) {
      node = node.left
    } else if (node.val < p.val && node.val < q.val) {
      node = node.right
    } else {
      return node
    }
  }
}