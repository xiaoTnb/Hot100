import type { CodeLine, PlayerMethod } from '../../components/player/types'

export interface CycleEntryStep {
  phase: 'detect' | 'reset' | 'seek' | 'found'
  slow: number
  other: number
  otherLabel: 'fast' | 'head'
  lineId: string
  message: string
}

export const cycleEntryMethods: PlayerMethod[] = [
  { id: 'floyd-entry', label: 'Floyd 两阶段', complexity: 'O(N) · O(1)', languages: ['java'] },
]

export const cycleEntryCode: CodeLine[] = [
  { id: 'class', text: 'public class Solution {' },
  { id: 'function', text: '  public ListNode detectCycle(ListNode head) {' },
  { id: 'init', text: '    ListNode slow = head, fast = head;' },
  { id: 'outer-loop', text: '    while (fast != null && fast.next != null) {' },
  { id: 'slow-move', text: '      slow = slow.next;' },
  { id: 'fast-move', text: '      fast = fast.next.next;' },
  { id: 'meet', text: '      if (fast == slow) {' },
  { id: 'inner-loop', text: '        while (slow != head) {' },
  { id: 'seek-slow', text: '          slow = slow.next;' },
  { id: 'seek-head', text: '          head = head.next;' },
  { id: 'inner-close', text: '        }' },
  { id: 'return', text: '        return slow;' },
  { id: 'if-close', text: '      }' },
  { id: 'outer-close', text: '    }' },
  { id: 'null', text: '    return null;' },
  { id: 'method-close', text: '  }' },
  { id: 'end', text: '}' },
]

export const cycleEntrySteps: CycleEntryStep[] = [
  { phase: 'detect', slow: 0, other: 0, otherLabel: 'fast', lineId: 'init', message: '阶段一：slow 与 fast 从 head 出发，寻找环内相遇点' },
  { phase: 'detect', slow: 1, other: 2, otherLabel: 'fast', lineId: 'fast-move', message: 'slow 走一步，fast 走两步，二者进入环中' },
  { phase: 'detect', slow: 2, other: 1, otherLabel: 'fast', lineId: 'meet', message: 'fast 绕过环尾，正在从后方追赶 slow' },
  { phase: 'detect', slow: 3, other: 3, otherLabel: 'fast', lineId: 'meet', message: 'fast 与 slow 在环内第一次相遇，证明链表有环' },
  { phase: 'reset', slow: 3, other: 0, otherLabel: 'head', lineId: 'inner-loop', message: '阶段二：slow 留在相遇点，head 从表头出发；两者都改为每轮一步' },
  { phase: 'seek', slow: 1, other: 1, otherLabel: 'head', lineId: 'seek-head', message: 'slow = slow.next，head = head.next；同速后在节点 2 相遇' },
  { phase: 'found', slow: 1, other: 1, otherLabel: 'head', lineId: 'return', message: 'slow == head，这个共同引用就是环入口，返回 slow' },
]
