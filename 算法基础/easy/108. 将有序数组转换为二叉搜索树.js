/**
 * 二叉搜索树：它或者是一棵空树，或者是具有下列性质的二叉树： 若它的左子树不空，则左子树上所有结点的值均小于它的根结点的值； 若它的右子树不空，则右子树上所有结点的值均大于它的根结点的值； 它的左、右子树也分别为二叉排序树
 * 二叉搜索树的中序遍历是升序序列
 * 给定二叉搜索树的中序遍历，是否可以唯一地确定二叉搜索树？答案是否定的。如果没有要求二叉搜索树的高度平衡，则任何一个数字都可以作为二叉搜索树的根节点，因此可能的二叉搜索树有多个
 * 如果增加一个限制条件，即要求二叉搜索树的高度平衡，是否可以唯一地确定二叉搜索树？答案仍然是否定的
 * 直观地看，我们可以选择中间数字作为二叉搜索树的根节点，这样分给左右子树的数字个数相同或只相差 1，可以使得树保持平衡。
 * [-10,-3,0,5,9]
 */
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
var sortedArrayToBST = function(nums) {
  if (nums.length === 0) return null
  let mid = Math.floor((nums.length)/2)
  let root = new TreeNode(nums[mid])
  // 多挂载3个参数用于比较
  root.index = mid; root.start = 0; root.end = nums.length-1
  let stack = [root]
  while (stack.length) {
    let node = stack.pop()
    // 可能的细分，左半边
    if (node.index-1>=node.start) {
      let leftMid = Math.floor((node.start+node.index-1)/2)
      let leftNode = new TreeNode(nums[leftMid])
      node.left = leftNode // 挂载在 node 下，而不是 root 下
      leftNode.start = node.start
      leftNode.index = leftMid;
      leftNode.end = node.index-1
      stack.push(leftNode)
    }
    if (node.index+1<=node.end) {
      let rightMid = Math.floor((node.end+node.index+1)/2)
      let rightNode = new TreeNode(nums[rightMid])
      node.right = rightNode
      rightNode.start = node.index+1
      rightNode.index = rightMid;
      rightNode.end = node.end
      stack.push(rightNode)
    }
  }
  return root
}