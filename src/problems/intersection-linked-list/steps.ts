import type { CodeLine, PlayerMethod } from '../../components/player/types'

export type PointerPosition = 'a0' | 'a1' | 'b0' | 'b1' | 'b2' | 'c0' | 'c1' | 'c2' | 'null-a' | 'null-b'

export interface IntersectionStep {
  p: PointerPosition
  q: PointerPosition
  pDistance: number
  qDistance: number
  phase: 'start' | 'walk' | 'switch' | 'found'
  lineId: string
  message: string
}

export const intersectionMethods: PlayerMethod[] = [
  { id: 'two-pointer', label: '双指针换轨', complexity: 'O(M + N) · O(1)', languages: ['java'] },
]

export const intersectionCode: CodeLine[] = [
  { id: 'class', text: 'class Solution {' },
  { id: 'function', text: '  public ListNode getIntersectionNode(ListNode headA, ListNode headB) {' },
  { id: 'init', text: '    ListNode p = headA;' },
  { id: 'init-q', text: '    ListNode q = headB;' },
  { id: 'while', text: '    while (p != q) {' },
  { id: 'move-p', text: '      p = p != null ? p.next : headB;' },
  { id: 'move-q', text: '      q = q != null ? q.next : headA;' },
  { id: 'close', text: '    }' },
  { id: 'return', text: '    return p;' },
  { id: 'method-close', text: '  }' },
  { id: 'end', text: '}' },
]

export const intersectionSteps: IntersectionStep[] = [
  { p: 'a0', q: 'b0', pDistance: 0, qDistance: 0, phase: 'start', lineId: 'init', message: 'p 从链表 A 的表头出发，q 从链表 B 的表头出发' },
  { p: 'a1', q: 'b1', pDistance: 1, qDistance: 1, phase: 'walk', lineId: 'while', message: '两指针保持同速：p 到达 a₂，q 到达 b₂' },
  { p: 'c0', q: 'b2', pDistance: 2, qDistance: 2, phase: 'walk', lineId: 'while', message: 'p 先进入公共链段，但 q 还在 B 的独有部分' },
  { p: 'c1', q: 'c0', pDistance: 3, qDistance: 3, phase: 'walk', lineId: 'while', message: 'q 也进入公共链段；两者仍相差一个节点' },
  { p: 'c2', q: 'c1', pDistance: 4, qDistance: 4, phase: 'walk', lineId: 'while', message: '继续同步前进，长度差仍然存在' },
  { p: 'null-a', q: 'c2', pDistance: 5, qDistance: 5, phase: 'walk', lineId: 'move-p', message: 'p 先走完 A 到达 null；下一步将切换到 headB' },
  { p: 'b0', q: 'null-b', pDistance: 6, qDistance: 6, phase: 'switch', lineId: 'move-p', message: 'p 换到 B 的表头；同时 q 走完 B，准备换到 headA' },
  { p: 'b1', q: 'a0', pDistance: 7, qDistance: 7, phase: 'switch', lineId: 'move-q', message: 'q 换到 A 的表头；现在两者已经交换过路线' },
  { p: 'b2', q: 'a1', pDistance: 8, qDistance: 8, phase: 'walk', lineId: 'while', message: '两指针都走过相同总距离，独有链段的长度差被抵消' },
  { p: 'c0', q: 'c0', pDistance: 9, qDistance: 9, phase: 'found', lineId: 'return', message: 'p 与 q 在值为 8 的同一个节点相遇，返回这个交点' },
]
