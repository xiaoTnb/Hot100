import type { CodeLine, PlayerMethod } from '../../components/player/types'

export interface RemoveNthStep { slow: number; fast: number; phase: 'start' | 'gap' | 'sync' | 'remove' | 'done'; removed: boolean; lineId: string; message: string }
export const removeNthMethods: PlayerMethod[] = [{ id: 'gap', label: '前后指针 · 哨兵', complexity: 'O(N) · O(1)', languages: ['java'] }]
export const removeNthCode: CodeLine[] = [
  { id: 'function', text: 'class Solution {' },
  { id: 'method', text: '  public ListNode removeNthFromEnd(ListNode head, int n) {' },
  { id: 'dummy', text: '    ListNode dummy = new ListNode(0, head);' },
  { id: 'init-slow', text: '    ListNode left = dummy;' },
  { id: 'init-fast', text: '    ListNode right = dummy;' },
  { id: 'gap-loop', text: '    while (n-- > 0) {' },
  { id: 'gap-move', text: '      right = right.next;' },
  { id: 'gap-close', text: '    }' },
  { id: 'sync-loop', text: '    while (right.next != null) {' },
  { id: 'slow-move', text: '      left = left.next;' },
  { id: 'fast-move', text: '      right = right.next;' },
  { id: 'sync-close', text: '    }' },
  { id: 'remove', text: '    left.next = left.next.next;' },
  { id: 'return', text: '    return dummy.next;' },
  { id: 'end', text: '  }' },
  { id: 'class-end', text: '}' },
]
export const removeNthSteps: RemoveNthStep[] = [
  { slow: -1, fast: -1, phase: 'start', removed: false, lineId: 'dummy', message: '创建 dummy；slow 与 fast 都从 dummy 出发' },
  { slow: -1, fast: 0, phase: 'gap', removed: false, lineId: 'gap-move', message: 'right 先走第 1 步：从 dummy 到节点 1' },
  { slow: -1, fast: 1, phase: 'gap', removed: false, lineId: 'gap-move', message: 'right 再走第 2 步：到节点 2；与 left 建立 n = 2 的间距' },
  { slow: 0, fast: 2, phase: 'sync', removed: false, lineId: 'slow-move', message: '同步移动：slow 到 1，fast 到 3，间距保持不变' },
  { slow: 1, fast: 3, phase: 'sync', removed: false, lineId: 'slow-move', message: '同步移动：slow 到 2，fast 到 4' },
  { slow: 2, fast: 4, phase: 'sync', removed: false, lineId: 'sync-loop', message: 'fast 到达尾节点 5；slow 停在待删节点 4 的前驱 3' },
  { slow: 2, fast: 4, phase: 'remove', removed: true, lineId: 'remove', message: '让 slow.next 跳过节点 4，直接连接到节点 5' },
  { slow: -2, fast: -2, phase: 'done', removed: true, lineId: 'return', message: '返回 dummy.next，结果链表为 [1, 2, 3, 5]' },
]
