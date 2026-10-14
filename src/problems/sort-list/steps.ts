import type { CodeLine, PlayerMethod } from '../../components/player/types'

export type SortListMethod = 'top-down' | 'bottom-up'
export type SortDirection = 'down' | 'up' | 'iterate' | 'done'

export interface SortListStep {
  groups: number[][]
  level: number
  direction: SortDirection
  active: number[]
  comparison?: [number, number]
  stepSize?: number
  pointers?: { pre: number | null; slow: number | null; fast: number | null }
  lineId: string
  message: string
}

export const sortListMethods: PlayerMethod[] = [
  { id: 'top-down', label: '自顶向下分治', complexity: 'O(N log N) · O(log N)', languages: ['java'] },
  { id: 'bottom-up', label: '自底向上迭代', complexity: 'O(N log N) · O(1)', languages: ['java'] },
]

const topDownCode: CodeLine[] = [
  { id: 'td-class', text: 'class Solution {' },
  { id: 'td-sort', text: '  public ListNode sortList(ListNode head) {' },
  { id: 'td-base', text: '    if (head == null || head.next == null) return head;' },
  { id: 'td-middle', text: '    ListNode head2 = middleNode(head);' },
  { id: 'td-left', text: '    head = sortList(head);' },
  { id: 'td-right', text: '    head2 = sortList(head2);' },
  { id: 'td-return', text: '    return mergeTwoLists(head, head2);' },
  { id: 'td-sort-end', text: '  }' },
  { id: 'td-blank-1', text: '' },
  { id: 'td-mid', text: '  private ListNode middleNode(ListNode head) {' },
  { id: 'td-mid-init', text: '    ListNode pre = head, slow = head, fast = head;' },
  { id: 'td-mid-loop', text: '    while (fast != null && fast.next != null) {' },
  { id: 'td-mid-move', text: '      pre = slow; slow = slow.next; fast = fast.next.next;' },
  { id: 'td-mid-loop-end', text: '    }' },
  { id: 'td-cut', text: '    pre.next = null;' },
  { id: 'td-mid-return', text: '    return slow;' },
  { id: 'td-mid-end', text: '  }' },
  { id: 'td-blank-2', text: '' },
  { id: 'td-merge', text: '  private ListNode mergeTwoLists(ListNode a, ListNode b) {' },
  { id: 'td-dummy', text: '    ListNode dummy = new ListNode(), cur = dummy;' },
  { id: 'td-merge-loop', text: '    while (a != null && b != null) {' },
  { id: 'td-compare', text: '      if (a.val <= b.val) { cur.next = a; a = a.next; }' },
  { id: 'td-pick-right', text: '      else { cur.next = b; b = b.next; }' },
  { id: 'td-cur', text: '      cur = cur.next;' },
  { id: 'td-merge-loop-end', text: '    }' },
  { id: 'td-rest', text: '    cur.next = a != null ? a : b;' },
  { id: 'td-merge-return', text: '    return dummy.next;' },
  { id: 'td-merge-end', text: '  }' },
  { id: 'td-class-end', text: '}' },
]

const bottomUpCode: CodeLine[] = [
  { id: 'bu-class', text: 'class Solution {' },
  { id: 'bu-sort', text: '  public ListNode sortList(ListNode head) {' },
  { id: 'bu-base', text: '    if (head == null || head.next == null) return head;' },
  { id: 'bu-length', text: '    int length = getListLength(head);' },
  { id: 'bu-dummy', text: '    ListNode dummy = new ListNode(0, head);' },
  { id: 'bu-step', text: '    for (int step = 1; step < length; step *= 2) {' },
  { id: 'bu-init', text: '      ListNode newListTail = dummy, cur = dummy.next;' },
  { id: 'bu-loop', text: '      while (cur != null) {' },
  { id: 'bu-head1', text: '        ListNode head1 = cur;' },
  { id: 'bu-head2', text: '        ListNode head2 = splitList(head1, step);' },
  { id: 'bu-next', text: '        cur = splitList(head2, step);' },
  { id: 'bu-merge', text: '        ListNode[] merged = mergeTwoLists(head1, head2);' },
  { id: 'bu-connect', text: '        newListTail.next = merged[0];' },
  { id: 'bu-tail', text: '        newListTail = merged[1];' },
  { id: 'bu-loop-end', text: '      }' },
  { id: 'bu-step-end', text: '    }' },
  { id: 'bu-return', text: '    return dummy.next;' },
  { id: 'bu-sort-end', text: '  }' },
  { id: 'bu-blank-1', text: '' },
  { id: 'bu-length-method', text: '  private int getListLength(ListNode head) {' },
  { id: 'bu-length-body', text: '    int length = 0; for (; head != null; head = head.next) length++;' },
  { id: 'bu-length-return', text: '    return length;' },
  { id: 'bu-length-end', text: '  }' },
  { id: 'bu-blank-2', text: '' },
  { id: 'bu-split', text: '  private ListNode splitList(ListNode head, int size) {' },
  { id: 'bu-split-walk', text: '    for (int i = 1; head != null && i < size; i++) head = head.next;' },
  { id: 'bu-split-null', text: '    if (head == null) return null;' },
  { id: 'bu-split-next', text: '    ListNode next = head.next;' },
  { id: 'bu-split-cut', text: '    head.next = null;' },
  { id: 'bu-split-return', text: '    return next;' },
  { id: 'bu-split-end', text: '  }' },
  { id: 'bu-blank-3', text: '' },
  { id: 'bu-merge-method', text: '  private ListNode[] mergeTwoLists(ListNode a, ListNode b) {' },
  { id: 'bu-merge-dummy', text: '    ListNode dummy = new ListNode(), cur = dummy;' },
  { id: 'bu-merge-loop', text: '    while (a != null && b != null) {' },
  { id: 'bu-merge-pick', text: '      if (a.val <= b.val) { cur.next = a; a = a.next; }' },
  { id: 'bu-merge-else', text: '      else { cur.next = b; b = b.next; }' },
  { id: 'bu-merge-cur', text: '      cur = cur.next;' },
  { id: 'bu-merge-loop-end', text: '    }' },
  { id: 'bu-merge-rest', text: '    cur.next = a != null ? a : b;' },
  { id: 'bu-find-tail', text: '    while (cur.next != null) cur = cur.next;' },
  { id: 'bu-merge-return', text: '    return new ListNode[]{dummy.next, cur};' },
  { id: 'bu-merge-end', text: '  }' },
  { id: 'bu-class-end', text: '}' },
]

const topDownSteps: SortListStep[] = [
  { groups: [[4, 2, 1, 3]], level: 0, direction: 'down', active: [4], pointers: { pre: 4, slow: 4, fast: 4 }, lineId: 'td-mid-init', message: '进入 middleNode：pre、slow、fast 都从头节点 4 出发' },
  { groups: [[4, 2, 1, 3]], level: 0, direction: 'down', active: [4, 2, 1], pointers: { pre: 4, slow: 2, fast: 1 }, lineId: 'td-mid-move', message: '第一轮：pre 跟到 4，slow 走一步到 2，fast 走两步到 1' },
  { groups: [[4, 2, 1, 3]], level: 0, direction: 'down', active: [2, 1], pointers: { pre: 2, slow: 1, fast: null }, lineId: 'td-mid-move', message: '第二轮：pre 到 2，slow 到 1，fast 越过链尾变为 null，循环结束' },
  { groups: [[4, 2], [1, 3]], level: 1, direction: 'down', active: [2, 1], pointers: { pre: 2, slow: 1, fast: null }, lineId: 'td-cut', message: '执行 pre.next = null：在 2 和 1 之间断开，得到 [4,2] 与 [1,3]' },
  { groups: [[4], [2], [1], [3]], level: 2, direction: 'down', active: [4, 2, 1, 3], lineId: 'td-base', message: '继续递归拆分；单节点满足递归边界，本身已经有序' },
  { groups: [[2, 4], [1], [3]], level: 2, direction: 'up', active: [2, 4], comparison: [4, 2], lineId: 'td-pick-right', message: '归并 [4] 与 [2]：比较头节点，先接较小的 2，再接 4' },
  { groups: [[2, 4], [1, 3]], level: 2, direction: 'up', active: [1, 3], comparison: [1, 3], lineId: 'td-compare', message: '归并另一半 [1] 与 [3]，得到有序子链 [1, 3]' },
  { groups: [[1, 2, 3, 4]], level: 1, direction: 'up', active: [1, 2, 3, 4], comparison: [2, 1], lineId: 'td-return', message: '顶层合并 [2, 4] 与 [1, 3]，依次接入 1、2、3、4' },
  { groups: [[1, 2, 3, 4]], level: 0, direction: 'done', active: [], lineId: 'td-return', message: '自顶向下排序完成；递归调用栈占用 O(log n) 空间' },
]

const bottomUpSteps: SortListStep[] = [
  { groups: [[4, 2, 1, 3]], level: 0, direction: 'iterate', active: [4, 2, 1, 3], stepSize: 0, lineId: 'bu-length', message: '先遍历链表得到 length = 4；后续只改 next，不使用递归栈' },
  { groups: [[4], [2], [1], [3]], level: 2, direction: 'iterate', active: [4, 2, 1, 3], stepSize: 1, lineId: 'bu-split-cut', message: 'step = 1：splitList 每次切出长度为 1 的两段' },
  { groups: [[2, 4], [1, 3]], level: 1, direction: 'iterate', active: [2, 4, 1, 3], comparison: [4, 2], stepSize: 1, lineId: 'bu-merge', message: 'step = 1 完成：[4] + [2] → [2,4]，[1] + [3] → [1,3]' },
  { groups: [[2, 4], [1, 3]], level: 1, direction: 'iterate', active: [2, 1], comparison: [2, 1], stepSize: 2, lineId: 'bu-step', message: 'step *= 2 变为 2；本轮把相邻的两条长度 2 子链合并' },
  { groups: [[1, 2, 3, 4]], level: 0, direction: 'iterate', active: [1, 2, 3, 4], stepSize: 2, lineId: 'bu-connect', message: 'step = 2 完成：[2,4] + [1,3] → [1,2,3,4]' },
  { groups: [[1, 2, 3, 4]], level: 0, direction: 'done', active: [], stepSize: 4, lineId: 'bu-return', message: 'step = 4 不再小于 length，返回结果；额外空间为 O(1)' },
]

export function getSortListCode(method: SortListMethod) {
  return method === 'top-down' ? topDownCode : bottomUpCode
}

export function getSortListSteps(method: SortListMethod) {
  return method === 'top-down' ? topDownSteps : bottomUpSteps
}
