import type { CodeLine, PlayerMethod } from '../../components/player/types'
export type ReverseMethod = 'iterative' | 'recursive'
export type ReversePhase = 'start' | 'save' | 'link' | 'move' | 'descend' | 'base' | 'unwind' | 'done'
export interface ReverseStep { phase: ReversePhase; reversed: number[]; remaining: number[]; stack: number[]; cur: number | null; next: number | null; lineId: string; message: string }
export const reverseInput = [1, 2, 3, 4, 5]
export const reverseMethods: PlayerMethod[] = [
  { id: 'iterative', label: '迭代 · 头插法', complexity: 'O(N) · O(1)', languages: ['java'] },
  { id: 'recursive', label: '递归 · 尾插法', complexity: 'O(N) · O(N)', languages: ['java'] },
]
const iterativeCode: CodeLine[] = [
  { id: 'i-class', text: 'class Solution {' }, { id: 'i-method', text: '  public ListNode reverseList(ListNode head) {' }, { id: 'i-pre', text: '    ListNode pre = null;' }, { id: 'i-cur', text: '    ListNode cur = head;' }, { id: 'i-while', text: '    while (cur != null) {' }, { id: 'i-next', text: '      ListNode nxt = cur.next;' }, { id: 'i-link', text: '      cur.next = pre;' }, { id: 'i-move-pre', text: '      pre = cur;' }, { id: 'i-move-cur', text: '      cur = nxt;' }, { id: 'i-close', text: '    }' }, { id: 'i-return', text: '    return pre;' }, { id: 'i-method-close', text: '  }' }, { id: 'i-class-close', text: '}' },
]
const recursiveCode: CodeLine[] = [
  { id: 'r-class', text: 'class Solution {' }, { id: 'r-comment', text: '  // 先递到末尾，再在回程中把节点接到尾部' }, { id: 'r-method', text: '  public ListNode reverseList(ListNode head) {' }, { id: 'r-base-if', text: '    if (head == null || head.next == null) {' }, { id: 'r-base-return', text: '      return head;' }, { id: 'r-base-close', text: '    }' }, { id: 'r-call', text: '    ListNode revHead = reverseList(head.next);' }, { id: 'r-tail', text: '    ListNode tail = head.next;' }, { id: 'r-link', text: '    tail.next = head;' }, { id: 'r-null', text: '    head.next = null;' }, { id: 'r-return', text: '    return revHead;' }, { id: 'r-method-close', text: '  }' }, { id: 'r-class-close', text: '}' },
]
export const getReverseCode = (method: ReverseMethod) => method === 'iterative' ? iterativeCode : recursiveCode
function iterativeSteps(): ReverseStep[] {
  const reversed: number[] = [], remaining = [...reverseInput], steps: ReverseStep[] = [{ phase: 'start', reversed: [], remaining: [...remaining], stack: [], cur: remaining[0], next: null, lineId: 'i-cur', message: 'pre = null，cur 指向头节点 1' }]
  while (remaining.length) {
    const cur = remaining[0], next = remaining[1] ?? null
    steps.push({ phase: 'save', reversed: [...reversed], remaining: [...remaining], stack: [], cur, next, lineId: 'i-next', message: '先保存 nxt = ' + (next ?? 'null') + '；否则改写 cur.next 后会丢失后面的链表' })
    remaining.shift(); reversed.unshift(cur)
    steps.push({ phase: 'link', reversed: [...reversed], remaining: [...remaining], stack: [], cur, next, lineId: 'i-link', message: 'cur.next = pre，把节点 ' + cur + ' 插到已反转链表头部' })
    steps.push({ phase: 'move', reversed: [...reversed], remaining: [...remaining], stack: [], cur: next, next: remaining[1] ?? null, lineId: 'i-move-cur', message: 'pre 移到 ' + cur + '，cur 移到之前保存的 nxt' })
  }
  steps.push({ phase: 'done', reversed, remaining, stack: [], cur: null, next: null, lineId: 'i-return', message: 'cur = null，返回 pre，即 5 → 4 → 3 → 2 → 1' })
  return steps
}
function recursiveSteps(): ReverseStep[] {
  const steps: ReverseStep[] = [], stack: number[] = []
  for (let i = 0; i < reverseInput.length; i++) {
    stack.push(reverseInput[i])
    steps.push({ phase: i === reverseInput.length - 1 ? 'base' : 'descend', reversed: i === reverseInput.length - 1 ? [reverseInput[i]] : [], remaining: reverseInput.slice(i), stack: [...stack], cur: reverseInput[i], next: reverseInput[i + 1] ?? null, lineId: i === reverseInput.length - 1 ? 'r-base-return' : 'r-call', message: i === reverseInput.length - 1 ? '到达末尾节点 5，递归基准返回它作为 revHead' : 'head = ' + reverseInput[i] + '，继续递归 reverseList(head.next)' })
  }
  const reversed = [reverseInput[reverseInput.length - 1]]
  for (let i = reverseInput.length - 2; i >= 0; i--) {
    stack.pop(); reversed.push(reverseInput[i])
    steps.push({ phase: 'unwind', reversed: [...reversed], remaining: reverseInput.slice(0, i), stack: [...stack], cur: reverseInput[i], next: reverseInput[i + 1], lineId: 'r-null', message: '回到 head = ' + reverseInput[i] + '：tail.next = head，再把 head.next 设为 null 防止成环' })
  }
  steps.push({ phase: 'done', reversed, remaining: [], stack: [], cur: null, next: null, lineId: 'r-return', message: '所有递归层返回同一个 revHead，链表反转完成' })
  return steps
}
export const makeReverseSteps = (method: ReverseMethod) => method === 'iterative' ? iterativeSteps() : recursiveSteps()
