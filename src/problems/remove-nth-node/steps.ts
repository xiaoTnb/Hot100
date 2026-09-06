import type { CodeLine, PlayerMethod } from '../../components/player/types'

export interface RemoveNthStep { slow: number; fast: number; phase: 'start' | 'gap' | 'sync' | 'remove' | 'done'; removed: boolean; lineId: string; message: string }
export const removeNthMethods: PlayerMethod[] = [{ id: 'gap', label: '快慢指针', complexity: 'O(N) · O(1)', languages: ['javascript'] }]
export const removeNthCode: CodeLine[] = [
  { id: 'function', text: 'var removeNthFromEnd = function (head, n) {' },
  { id: 'dummy', text: '  const dummy = new ListNode(0, head)' },
  { id: 'init-slow', text: '  let l1 = dummy' },
  { id: 'init-fast', text: '  let l2 = dummy' },
  { id: 'gap-loop', text: '  while (n--) {' },
  { id: 'gap-move', text: '    l2 = l2.next' },
  { id: 'gap-close', text: '  }' },
  { id: 'sync-loop', text: '  while (l2.next) {' },
  { id: 'fast-move', text: '    l2 = l2.next' },
  { id: 'slow-move', text: '    l1 = l1.next' },
  { id: 'sync-close', text: '  }' },
  { id: 'remove', text: '  l1.next = l1.next.next' },
  { id: 'return', text: '  return dummy.next' },
  { id: 'end', text: '}' },
]
export const removeNthSteps: RemoveNthStep[] = [
  { slow: -1, fast: -1, phase: 'start', removed: false, lineId: 'dummy', message: '创建 dummy；slow 与 fast 都从 dummy 出发' },
  { slow: -1, fast: 1, phase: 'gap', removed: false, lineId: 'gap-move', message: 'fast 先走 n = 2 步，在两个指针间建立固定间距' },
  { slow: 0, fast: 2, phase: 'sync', removed: false, lineId: 'slow-move', message: '同步移动：slow 到 1，fast 到 3，间距保持不变' },
  { slow: 1, fast: 3, phase: 'sync', removed: false, lineId: 'slow-move', message: '同步移动：slow 到 2，fast 到 4' },
  { slow: 2, fast: 4, phase: 'sync', removed: false, lineId: 'sync-loop', message: 'fast 到达尾节点 5；slow 停在待删节点 4 的前驱 3' },
  { slow: 2, fast: 4, phase: 'remove', removed: true, lineId: 'remove', message: '让 slow.next 跳过节点 4，直接连接到节点 5' },
  { slow: -2, fast: -2, phase: 'done', removed: true, lineId: 'return', message: '返回 dummy.next，结果链表为 [1, 2, 3, 5]' },
]
