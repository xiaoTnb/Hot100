import type { CodeLine, PlayerMethod } from '../../components/player/types'

export type KGroupPhase = 'count' | 'select' | 'save' | 'reverse' | 'move' | 'reconnect-tail' | 'reconnect-head' | 'advance' | 'done'
export interface KGroupStep { order: number[]; group: number[]; fixed: number[]; pre: number | null; cur: number | null; next: number | null; lastTail: number; phase: KGroupPhase; lineId: string; message: string }
export const kGroupMethods: PlayerMethod[] = [{ id: 'count-first', label: '计数 + 分组反转', complexity: 'O(N) · O(1)', languages: ['java'] }]
export const kGroupCode: CodeLine[] = [
  { id: 'class', text: 'class Solution {' },
  { id: 'method', text: '  public ListNode reverseKGroup(ListNode head, int k) {' },
  { id: 'count-init', text: '    int n = 0;' },
  { id: 'count', text: '    for (ListNode cur = head; cur != null; cur = cur.next) n++;' },
  { id: 'dummy', text: '    ListNode dummy = new ListNode(0, head);' },
  { id: 'last-tail', text: '    ListNode lastTail = dummy;' },
  { id: 'group-loop', text: '    for (; n >= k; n -= k) {' },
  { id: 'pre', text: '      ListNode pre = null;' },
  { id: 'cur', text: '      ListNode cur = lastTail.next;' },
  { id: 'reverse-loop', text: '      for (int i = 0; i < k; i++) {' },
  { id: 'next', text: '        ListNode nxt = cur.next;' },
  { id: 'reverse', text: '        cur.next = pre;' },
  { id: 'move-pre', text: '        pre = cur;' },
  { id: 'move-cur', text: '        cur = nxt;' },
  { id: 'reverse-close', text: '      }' },
  { id: 'tail', text: '      ListNode tail = lastTail.next;' },
  { id: 'connect-tail', text: '      tail.next = cur;' },
  { id: 'connect-head', text: '      lastTail.next = pre;' },
  { id: 'advance', text: '      lastTail = tail;' },
  { id: 'group-close', text: '    }' },
  { id: 'return', text: '    return dummy.next;' },
  { id: 'method-close', text: '  }' },
  { id: 'class-close', text: '}' },
]

export const kGroupSteps: KGroupStep[] = [
  { order:[1,2,3,4,5], group:[], fixed:[], pre:null, cur:1, next:null, lastTail:0, phase:'count', lineId:'count', message:'先遍历链表得到 n = 5；只有剩余节点数不少于 k = 2 时才反转' },
  { order:[1,2,3,4,5], group:[1,2], fixed:[], pre:null, cur:1, next:2, lastTail:0, phase:'select', lineId:'cur', message:'第一组有 2 个节点：pre = null，cur 指向节点 1' },
  { order:[1,2,3,4,5], group:[1,2], fixed:[], pre:null, cur:1, next:2, lastTail:0, phase:'save', lineId:'next', message:'保存 nxt = 2，防止改写 cur.next 后丢失后续节点' },
  { order:[1,2,3,4,5], group:[1,2], fixed:[], pre:1, cur:2, next:3, lastTail:0, phase:'reverse', lineId:'move-cur', message:'节点 1 指向 null；pre 移到 1，cur 移到 2' },
  { order:[2,1,3,4,5], group:[1,2], fixed:[], pre:2, cur:3, next:3, lastTail:0, phase:'reverse', lineId:'move-cur', message:'节点 2 指向 1；第一组内部反转为 2 → 1' },
  { order:[2,1,3,4,5], group:[1,2], fixed:[], pre:2, cur:3, next:null, lastTail:0, phase:'reconnect-tail', lineId:'connect-tail', message:'tail 是旧组头 1：tail.next = cur，把 1 接回下一组起点 3' },
  { order:[2,1,3,4,5], group:[1,2], fixed:[2,1], pre:2, cur:3, next:null, lastTail:0, phase:'reconnect-head', lineId:'connect-head', message:'lastTail.next = pre，让 dummy 指向新组头 2' },
  { order:[2,1,3,4,5], group:[3,4], fixed:[2,1], pre:null, cur:3, next:4, lastTail:1, phase:'advance', lineId:'advance', message:'lastTail 移到本组尾 1；剩余 n = 3，继续处理节点 3、4' },
  { order:[2,1,3,4,5], group:[3,4], fixed:[2,1], pre:3, cur:4, next:5, lastTail:1, phase:'reverse', lineId:'move-cur', message:'节点 3 的 next 反向指向 null，pre = 3，cur = 4' },
  { order:[2,1,4,3,5], group:[3,4], fixed:[2,1], pre:4, cur:5, next:5, lastTail:1, phase:'reverse', lineId:'move-cur', message:'节点 4 指向 3；第二组内部反转为 4 → 3' },
  { order:[2,1,4,3,5], group:[3,4], fixed:[2,1], pre:4, cur:5, next:null, lastTail:1, phase:'reconnect-tail', lineId:'connect-tail', message:'旧组头 3 变成尾节点，tail.next = 5，接回剩余链表' },
  { order:[2,1,4,3,5], group:[3,4], fixed:[2,1,4,3], pre:4, cur:5, next:null, lastTail:1, phase:'reconnect-head', lineId:'connect-head', message:'节点 1 指向新组头 4，第二组接回主链' },
  { order:[2,1,4,3,5], group:[5], fixed:[2,1,4,3], pre:null, cur:5, next:null, lastTail:3, phase:'done', lineId:'return', message:'只剩 1 个节点，小于 k = 2，不反转；返回 2 → 1 → 4 → 3 → 5' },
]
