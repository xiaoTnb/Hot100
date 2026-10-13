import type { CodeLine, PlayerMethod } from '../../components/player/types'
export interface SwapStep { order: number[]; pair: number[]; cur: number; phase: 'start' | 'select' | 'swap' | 'advance' | 'done'; lineId: string; message: string }
export const swapMethods: PlayerMethod[] = [{ id: 'iterative', label: '迭代 · 哨兵重连', complexity: 'O(N) · O(1)', languages: ['java'] }]
export const swapCode: CodeLine[] = [
  { id: 'function', text: 'class Solution {' }, { id: 'method', text: '  public ListNode swapPairs(ListNode head) {' }, { id: 'dummy', text: '    ListNode dummy = new ListNode(0, head);' }, { id: 'cur', text: '    ListNode node0 = dummy;' }, { id: 'l1-init', text: '    ListNode node1 = head;' }, { id: 'while', text: '    while (node1 != null && node1.next != null) {' }, { id: 'l2', text: '      ListNode node2 = node1.next;' }, { id: 'l3', text: '      ListNode node3 = node2.next;' }, { id: 'link-1', text: '      node0.next = node2;' }, { id: 'link-3', text: '      node2.next = node1;' }, { id: 'link-2', text: '      node1.next = node3;' }, { id: 'advance', text: '      node0 = node1;' }, { id: 'advance-1', text: '      node1 = node3;' }, { id: 'close', text: '    }' }, { id: 'return', text: '    return dummy.next;' }, { id: 'end', text: '  }' }, { id: 'class-end', text: '}' },
]
export const swapSteps: SwapStep[] = [
  { order: [1,2,3,4], pair: [], cur: 0, phase: 'start', lineId: 'dummy', message: 'dummy 指向 head，cur 从 dummy 开始' },
  { order: [1,2,3,4], pair: [1,2], cur: 0, phase: 'select', lineId: 'l2', message: '保存第一组：l1 = 1，l2 = 2' },
  { order: [1,2,3,4], pair: [1,2], cur: 0, phase: 'swap', lineId: 'link-1', message: '① node0.next = node2：dummy 先指向节点 2' },
  { order: [1,2,3,4], pair: [1,2], cur: 0, phase: 'swap', lineId: 'link-3', message: '② node2.next = node1：节点 2 再指回节点 1' },
  { order: [2,1,3,4], pair: [1,2], cur: 0, phase: 'swap', lineId: 'link-2', message: '③ node1.next = node3：节点 1 接回节点 3，第一组完成' },
  { order: [2,1,3,4], pair: [3,4], cur: 1, phase: 'advance', lineId: 'advance', message: 'cur 移到本组尾部节点 1，选中下一组 3、4' },
  { order: [2,1,3,4], pair: [3,4], cur: 1, phase: 'swap', lineId: 'link-1', message: '① node0.next = node2：上一组尾节点 1 指向节点 4' },
  { order: [2,1,3,4], pair: [3,4], cur: 1, phase: 'swap', lineId: 'link-3', message: '② node2.next = node1：节点 4 指向节点 3' },
  { order: [2,1,4,3], pair: [3,4], cur: 1, phase: 'swap', lineId: 'link-2', message: '③ node1.next = node3：节点 3 指向 null，第二组完成' },
  { order: [2,1,4,3], pair: [], cur: 3, phase: 'done', lineId: 'return', message: '没有完整的下一组，返回 dummy.next：[2, 1, 4, 3]' },
]
