import type { CodeLine, PlayerMethod } from '../../components/player/types'

export interface SortListStep {
  groups: number[][]
  level: 0 | 1 | 2
  direction: 'down' | 'up' | 'done'
  active: number[]
  comparison?: [number, number]
  lineId: string
  message: string
}

export const sortListMethods: PlayerMethod[] = [{ id: 'merge-sort', label: '归并排序', complexity: 'O(N log N) · O(log N)', languages: ['javascript'] }]
export const sortListCode: CodeLine[] = [
  { id: 'middle', text: 'function middleNode(head) {' },
  { id: 'mid-init', text: '  let pre = head, slow = head, fast = head' },
  { id: 'mid-loop', text: '  while (fast && fast.next) {' },
  { id: 'mid-move', text: '    pre = slow; slow = slow.next; fast = fast.next.next' },
  { id: 'cut', text: '  }' },
  { id: 'cut-link', text: '  pre.next = null' },
  { id: 'mid-return', text: '  return slow' },
  { id: 'mid-end', text: '}' },
  { id: 'blank-1', text: '' },
  { id: 'merge', text: 'function mergeTwoLists(list1, list2) {' },
  { id: 'dummy', text: '  const dummy = new ListNode()' },
  { id: 'merge-init', text: '  let cur = dummy' },
  { id: 'merge-loop', text: '  while (list1 && list2) {' },
  { id: 'compare', text: '    if (list1.val < list2.val) {' },
  { id: 'pick-left', text: '      cur.next = list1; list1 = list1.next' },
  { id: 'else', text: '    } else {' },
  { id: 'pick-right', text: '      cur.next = list2; list2 = list2.next' },
  { id: 'if-close', text: '    }' },
  { id: 'cur', text: '    cur = cur.next' },
  { id: 'merge-close', text: '  }' },
  { id: 'rest', text: '  cur.next = list1 ?? list2' },
  { id: 'merge-return', text: '  return dummy.next' },
  { id: 'merge-end', text: '}' },
  { id: 'blank-2', text: '' },
  { id: 'sort', text: 'var sortList = function (head) {' },
  { id: 'base', text: '  if (head === null || head.next === null) return head' },
  { id: 'split', text: '  let head2 = middleNode(head)' },
  { id: 'sort-left', text: '  head = sortList(head)' },
  { id: 'sort-right', text: '  head2 = sortList(head2)' },
  { id: 'sort-return', text: '  return mergeTwoLists(head, head2)' },
  { id: 'sort-end', text: '};' },
]

export const sortListSteps: SortListStep[] = [
  { groups: [[4, 2, 1, 3]], level: 0, direction: 'down', active: [4, 2, 1, 3], lineId: 'sort', message: '从完整链表开始归并排序，先向下递归拆分' },
  { groups: [[4, 2], [1, 3]], level: 1, direction: 'down', active: [2, 1], lineId: 'cut-link', message: '快慢指针找到中点，在 2 与 1 之间断开为左右两半' },
  { groups: [[4], [2], [1], [3]], level: 2, direction: 'down', active: [4, 2, 1, 3], lineId: 'base', message: '继续二分，直到每条子链只含一个节点；单节点天然有序' },
  { groups: [[2, 4], [1], [3]], level: 2, direction: 'up', active: [2, 4], comparison: [4, 2], lineId: 'pick-right', message: '回升第一步：比较 4 与 2，先接 2，再接剩余的 4' },
  { groups: [[2, 4], [1, 3]], level: 2, direction: 'up', active: [1, 3], comparison: [1, 3], lineId: 'pick-left', message: '另一侧比较 1 与 3，得到有序子链 [1, 3]' },
  { groups: [[1, 2, 3, 4]], level: 1, direction: 'up', active: [1, 2, 3, 4], comparison: [2, 1], lineId: 'sort-return', message: '合并 [2, 4] 与 [1, 3]，按较小值依次接入 1、2、3、4' },
  { groups: [[1, 2, 3, 4]], level: 0, direction: 'done', active: [], lineId: 'sort-return', message: '回到递归顶层，返回升序链表 [1, 2, 3, 4]' },
]
