import type { CodeLine, PlayerMethod } from '../../components/player/types'
export interface SwapStep { order: number[]; pair: number[]; cur: number; phase: 'start' | 'select' | 'swap' | 'advance' | 'done'; lineId: string; message: string }
export const swapMethods: PlayerMethod[] = [{ id: 'iterative', label: '迭代重连', complexity: 'O(N) · O(1)', languages: ['javascript'] }]
export const swapCode: CodeLine[] = [
  { id: 'function', text: 'var swapPairs = function (head) {' }, { id: 'dummy', text: '  let dummy = new ListNode(0, head)' }, { id: 'cur', text: '  let cur = dummy' }, { id: 'while', text: '  while (cur.next && cur.next.next) {' }, { id: 'l1', text: '    const l1 = cur.next' }, { id: 'l2', text: '    const l2 = cur.next.next' }, { id: 'blank', text: '' }, { id: 'link-1', text: '    cur.next = l2' }, { id: 'link-2', text: '    l1.next = l2.next' }, { id: 'link-3', text: '    l2.next = l1' }, { id: 'advance', text: '    cur = l1' }, { id: 'close', text: '  }' }, { id: 'return', text: '  return dummy.next' }, { id: 'end', text: '};' },
]
export const swapSteps: SwapStep[] = [
  { order: [1,2,3,4], pair: [], cur: 0, phase: 'start', lineId: 'dummy', message: 'dummy 指向 head，cur 从 dummy 开始' },
  { order: [1,2,3,4], pair: [1,2], cur: 0, phase: 'select', lineId: 'l2', message: '保存第一组：l1 = 1，l2 = 2' },
  { order: [2,1,3,4], pair: [1,2], cur: 0, phase: 'swap', lineId: 'link-3', message: '重连三条 next，节点 2 与节点 1 完成换位' },
  { order: [2,1,3,4], pair: [3,4], cur: 1, phase: 'advance', lineId: 'advance', message: 'cur 移到本组尾部节点 1，选中下一组 3、4' },
  { order: [2,1,4,3], pair: [3,4], cur: 1, phase: 'swap', lineId: 'link-3', message: '重连第二组，节点 4 移到节点 3 前面' },
  { order: [2,1,4,3], pair: [], cur: 3, phase: 'done', lineId: 'return', message: '没有完整的下一组，返回 dummy.next：[2, 1, 4, 3]' },
]
