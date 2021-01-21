/**
 * 将两个升序链表合并为一个新的 升序 链表并返回。新链表是通过拼接给定的两个链表的所有节点组成的
 * 输入：1->2->4, 1->3->4
 * 输出：1->1->2->3->4->4
 */
var mergeTwoLists = function(l1, l2) {
  if (l1 === null) return l2
  if (l2 === null) return l1
  let p = dummyHead = new ListNode()
  let p1 = l1, p2 = l2
  while (p1 && p2) {
    if (p1.val > p2.val) {
      p.next = p2 // 注意不是存值
      p2 = p2.next
    } else {
      p.next = p1
      p1 = p1.next
    }
    p = p.next
  }
  if (p1) {
    p.next = p1
  } else {
    p.next = p2
  }
  return dummyHead.next
}

var mergeTwoLists = function(l1, l2) {
  let merge = function(l1, l2) {
    if (l1 === null) return l2
    if (l2 === null) return l1
    if (l1.val < l2.val) {
      l1.next = merge(l1.next, l2)
      return l1
    } else {
      l2.next = merge(l1, l2.next)
      return l2
    }
  }
  return merge(l1, l2)
}