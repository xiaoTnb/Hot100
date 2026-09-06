import type { CodeLine, PlayerMethod } from '../../components/player/types'

export interface AddNumbersStep {
  index: number
  a: number
  b: number
  carryIn: number
  carryOut: number
  digit: number
  output: number[]
  phase: 'start' | 'sum' | 'done'
  lineId: string
  message: string
}

export const addListA = [2, 4, 3]
export const addListB = [5, 6, 4]
export const addNumbersMethods: PlayerMethod[] = [{ id: 'digit-add', label: '逐位相加', complexity: 'O(max(M,N)) · O(1)', languages: ['javascript'] }]
export const addNumbersCode: CodeLine[] = [
  { id: 'function', text: 'var addTwoNumbers = function (l1, l2) {' },
  { id: 'dummy', text: '  const dummy = new ListNode()' },
  { id: 'cur', text: '  let cur = dummy' },
  { id: 'carry', text: '  let carry = 0' },
  { id: 'while', text: '  while (l1 || l2 || carry) {' },
  { id: 'sum', text: '    const sum = (l1 ? l1.val : 0) + (l2 ? l2.val : 0) + carry' },
  { id: 'node', text: '    cur.next = new ListNode(sum % 10)' },
  { id: 'next-carry', text: '    carry = Math.floor(sum / 10)' },
  { id: 'move-cur', text: '    cur = cur.next' },
  { id: 'move-l1', text: '    if (l1) l1 = l1.next' },
  { id: 'move-l2', text: '    if (l2) l2 = l2.next' },
  { id: 'close', text: '  }' },
  { id: 'return', text: '  return dummy.next' },
  { id: 'end', text: '};' },
]
export const addNumbersSteps: AddNumbersStep[] = [
  { index: 0, a: 2, b: 5, carryIn: 0, carryOut: 0, digit: 0, output: [], phase: 'start', lineId: 'carry', message: '从最低位开始，carry 初始化为 0' },
  { index: 0, a: 2, b: 5, carryIn: 0, carryOut: 0, digit: 7, output: [7], phase: 'sum', lineId: 'node', message: '个位：2 + 5 + 0 = 7，写入节点 7，进位仍为 0' },
  { index: 1, a: 4, b: 6, carryIn: 0, carryOut: 1, digit: 0, output: [7, 0], phase: 'sum', lineId: 'next-carry', message: '十位：4 + 6 + 0 = 10，写入 0，并把 carry 更新为 1' },
  { index: 2, a: 3, b: 4, carryIn: 1, carryOut: 0, digit: 8, output: [7, 0, 8], phase: 'sum', lineId: 'node', message: '百位：3 + 4 + 1 = 8，写入 8，carry 回到 0' },
  { index: 3, a: 0, b: 0, carryIn: 0, carryOut: 0, digit: 0, output: [7, 0, 8], phase: 'done', lineId: 'return', message: '两条链表都遍历完成且无进位，返回 [7, 0, 8]，它表示整数 807' },
]
