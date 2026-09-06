import type { CodeLine, PlayerMethod } from '../../components/player/types'

export interface MergeListStep {
  i: number
  j: number
  merged: number[]
  pickedFrom: 'l1' | 'l2' | 'rest' | null
  phase: 'start' | 'pick' | 'rest' | 'done'
  lineId: string
  message: string
}

export const mergeListA = [1, 2, 4]
export const mergeListB = [1, 3, 4]
export const mergeListMethods: PlayerMethod[] = [{ id: 'merge', label: '双指针归并', complexity: 'O(M + N) · O(1)', languages: ['javascript'] }]

export const mergeListCode: CodeLine[] = [
  { id: 'function', text: 'var mergeTwoLists = function (list1, list2) {' },
  { id: 'dummy', text: '  const dummy = new ListNode()' },
  { id: 'cur', text: '  let cur = dummy' },
  { id: 'while', text: '  while (list1 && list2) {' },
  { id: 'compare', text: '    if (list1.val < list2.val) {' },
  { id: 'pick-l1', text: '      cur.next = list1' },
  { id: 'move-l1', text: '      list1 = list1.next' },
  { id: 'else', text: '    } else {' },
  { id: 'pick-l2', text: '      cur.next = list2' },
  { id: 'move-l2', text: '      list2 = list2.next' },
  { id: 'if-close', text: '    }' },
  { id: 'move-cur', text: '    cur = cur.next' },
  { id: 'while-close', text: '  }' },
  { id: 'rest', text: '  cur.next = list1 ?? list2' },
  { id: 'return', text: '  return dummy.next' },
  { id: 'end', text: '};' },
]

export const mergeListSteps: MergeListStep[] = [
  { i: 0, j: 0, merged: [], pickedFrom: null, phase: 'start', lineId: 'dummy', message: '创建 dummy 和尾指针 cur；两个输入指针都指向首节点' },
  { i: 0, j: 1, merged: [1], pickedFrom: 'l2', phase: 'pick', lineId: 'pick-l2', message: '1 与 1 相等，代码进入 else：先接入 l2 的 1' },
  { i: 1, j: 1, merged: [1, 1], pickedFrom: 'l1', phase: 'pick', lineId: 'pick-l1', message: 'l1 的 1 小于 l2 的 3，接入 l1 的 1' },
  { i: 2, j: 1, merged: [1, 1, 2], pickedFrom: 'l1', phase: 'pick', lineId: 'pick-l1', message: '2 小于 3，接入 l1 的 2，并移动 list1' },
  { i: 2, j: 2, merged: [1, 1, 2, 3], pickedFrom: 'l2', phase: 'pick', lineId: 'pick-l2', message: '4 大于 3，接入 l2 的 3，并移动 list2' },
  { i: 2, j: 3, merged: [1, 1, 2, 3, 4], pickedFrom: 'l2', phase: 'pick', lineId: 'pick-l2', message: '4 与 4 相等，接入 l2 的 4；此时 list2 已耗尽' },
  { i: 3, j: 3, merged: [1, 1, 2, 3, 4, 4], pickedFrom: 'rest', phase: 'rest', lineId: 'rest', message: '退出循环，把 list1 剩余的 4 整段接到 cur 后面' },
  { i: 3, j: 3, merged: [1, 1, 2, 3, 4, 4], pickedFrom: null, phase: 'done', lineId: 'return', message: '跳过 dummy，返回完整的升序链表 [1, 1, 2, 3, 4, 4]' },
]
