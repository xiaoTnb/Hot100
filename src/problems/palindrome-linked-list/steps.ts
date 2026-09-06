import type { CodeLine, PlayerMethod } from '../../components/player/types'

export type PalindromePhase = 'start' | 'middle' | 'reverse' | 'compare' | 'done'

export interface PalindromeStep {
  phase: PalindromePhase
  slow: number | null
  fast: number | null
  left: number | null
  right: number | null
  reversed: boolean
  compared: number[]
  lineId: string
  message: string
}

export const palindromeMethods: PlayerMethod[] = [
  { id: 'reverse-half', label: '快慢指针 + 反转', complexity: 'O(N) · O(1)', languages: ['javascript'] },
]

export const palindromeCode: CodeLine[] = [
  { id: 'middle-fn', text: 'function middleNode(head) {' },
  { id: 'middle-init', text: '  let slow = head, fast = head' },
  { id: 'middle-loop', text: '  while (fast !== null && fast.next !== null) {' },
  { id: 'slow-move', text: '    slow = slow.next' },
  { id: 'fast-move', text: '    fast = fast.next.next' },
  { id: 'middle-close', text: '  }' },
  { id: 'middle-return', text: '  return slow' },
  { id: 'middle-end', text: '}' },
  { id: 'blank-1', text: '' },
  { id: 'reverse-fn', text: 'function reverseList(head) {' },
  { id: 'reverse-init', text: '  let prev = null, current = head' },
  { id: 'reverse-loop', text: '  while (current !== null) {' },
  { id: 'reverse-next', text: '    const nextNode = current.next' },
  { id: 'reverse-link', text: '    current.next = prev' },
  { id: 'reverse-shift', text: '    prev = current; current = nextNode' },
  { id: 'reverse-close', text: '  }' },
  { id: 'reverse-return', text: '  return prev' },
  { id: 'reverse-end', text: '}' },
  { id: 'blank-2', text: '' },
  { id: 'main', text: 'var isPalindrome = function (head) {' },
  { id: 'find-mid', text: '  const mid = middleNode(head)' },
  { id: 'reverse-call', text: '  let head2 = reverseList(mid)' },
  { id: 'compare-loop', text: '  while (head2 !== null) {' },
  { id: 'compare', text: '    if (head.val !== head2.val) return false' },
  { id: 'advance', text: '    head = head.next; head2 = head2.next' },
  { id: 'compare-close', text: '  }' },
  { id: 'true', text: '  return true' },
  { id: 'main-end', text: '};' },
]

export const palindromeSteps: PalindromeStep[] = [
  { phase: 'start', slow: 0, fast: 0, left: null, right: null, reversed: false, compared: [], lineId: 'middle-init', message: 'slow 与 fast 都从表头出发，准备寻找后半段起点' },
  { phase: 'middle', slow: 1, fast: 2, left: null, right: null, reversed: false, compared: [], lineId: 'fast-move', message: 'slow 走一步到第 2 个节点，fast 走两步到第 3 个节点' },
  { phase: 'middle', slow: 2, fast: null, left: null, right: null, reversed: false, compared: [], lineId: 'middle-return', message: 'fast 走出链表，slow 正好停在后半段的起点' },
  { phase: 'reverse', slow: 2, fast: null, left: null, right: null, reversed: true, compared: [], lineId: 'reverse-link', message: '反转 slow 开始的后半段：1 → 2，得到新的表头 head2' },
  { phase: 'compare', slow: null, fast: null, left: 0, right: 3, reversed: true, compared: [], lineId: 'compare', message: '比较第一对：左侧 1 与反转后的 1 相等' },
  { phase: 'compare', slow: null, fast: null, left: 1, right: 2, reversed: true, compared: [0, 3], lineId: 'compare', message: '比较第二对：左侧 2 与反转后的 2 相等' },
  { phase: 'done', slow: null, fast: null, left: null, right: null, reversed: true, compared: [0, 1, 2, 3], lineId: 'true', message: '后半段全部比较完且没有差异，返回 true' },
]
