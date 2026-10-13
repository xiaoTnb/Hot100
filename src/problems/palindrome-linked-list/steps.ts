import type { CodeLine, PlayerMethod } from '../../components/player/types'

export type PalindromeMethod = 'recursive' | 'reverse-half'
export type PalindromePhase = 'start' | 'descend' | 'middle' | 'reverse' | 'compare' | 'done'
export interface PalindromeStep { phase: PalindromePhase; slow: number | null; fast: number | null; left: number | null; right: number | null; reversed: boolean; compared: number[]; stack: number[]; lineId: string; message: string; reversePrev?: number[]; reverseRemaining?: number[]; reverseHead?: number | null; reverseNext?: number | null; reverseStage?: 'init' | 'save' | 'link' | 'prev' | 'head' | 'done' }
export const palindromeValues = [1, 2, 3, 2, 1]
export const palindromeMethods: PlayerMethod[] = [
  { id: 'reverse-half', label: '中点 + 反转后半段', complexity: 'O(N) · O(1)', languages: ['java'] },
  { id: 'recursive', label: '递归 · 双向比较', complexity: 'O(N) · O(N)', languages: ['java'] },
]

const recursiveCode: CodeLine[] = [
  { id: 'r-class', text: 'class Solution {' },
  { id: 'r-left', text: '  private ListNode left;' },
  { id: 'r-main', text: '  public boolean isPalindrome(ListNode head) {' },
  { id: 'r-init', text: '    left = head;' },
  { id: 'r-call-main', text: '    return traverse(head);' },
  { id: 'r-main-close', text: '  }' },
  { id: 'r-traverse', text: '  private boolean traverse(ListNode right) {' },
  { id: 'r-base', text: '    if (right == null) return true;' },
  { id: 'r-call', text: '    if (!traverse(right.next)) return false;' },
  { id: 'r-compare', text: '    if (left.val != right.val) return false;' },
  { id: 'r-move', text: '    left = left.next;' },
  { id: 'r-true', text: '    return true;' },
  { id: 'r-traverse-close', text: '  }' },
  { id: 'r-class-close', text: '}' },
]

const halfCode: CodeLine[] = [
  { id: 'h-class', text: 'class Solution {' },
  { id: 'h-main', text: '  public boolean isPalindrome(ListNode head) {' },
  { id: 'h-mid-call', text: '    ListNode mid = middleNode(head);' },
  { id: 'h-reverse-call', text: '    ListNode head2 = reverseList(mid);' },
  { id: 'h-loop', text: '    while (head2 != null) {' },
  { id: 'h-compare', text: '      if (head.val != head2.val) return false;' },
  { id: 'h-move-left', text: '      head = head.next;' },
  { id: 'h-move-right', text: '      head2 = head2.next;' },
  { id: 'h-loop-close', text: '    }' },
  { id: 'h-true', text: '    return true;' },
  { id: 'h-main-close', text: '  }' },
  { id: 'h-middle', text: '  private ListNode middleNode(ListNode head) {' },
  { id: 'h-mid-init', text: '    ListNode slow = head, fast = head;' },
  { id: 'h-mid-loop', text: '    while (fast != null && fast.next != null) {' },
  { id: 'h-slow', text: '      slow = slow.next;' },
  { id: 'h-fast', text: '      fast = fast.next.next;' },
  { id: 'h-mid-close', text: '    }' },
  { id: 'h-mid-return', text: '    return slow;' },
  { id: 'h-middle-close', text: '  }' },
  { id: 'h-reverse', text: '  private ListNode reverseList(ListNode head) {' },
  { id: 'h-prev', text: '    ListNode prev = null;' },
  { id: 'h-reverse-loop', text: '    while (head != null) {' },
  { id: 'h-next', text: '      ListNode next = head.next;' },
  { id: 'h-link', text: '      head.next = prev;' },
  { id: 'h-shift-prev', text: '      prev = head;' },
  { id: 'h-shift-head', text: '      head = next;' },
  { id: 'h-reverse-close', text: '    }' },
  { id: 'h-reverse-return', text: '    return prev;' },
  { id: 'h-reverse-method-close', text: '  }' },
  { id: 'h-class-close', text: '}' },
]

export const getPalindromeCode = (method: PalindromeMethod) => method === 'recursive' ? recursiveCode : halfCode

function recursiveSteps(): PalindromeStep[] {
  const steps: PalindromeStep[] = [{ phase: 'start', slow: null, fast: null, left: 0, right: 0, reversed: false, compared: [], stack: [], lineId: 'r-init', message: 'left 固定从表头出发，right 准备递归到链表末尾' }]
  const stack: number[] = []
  for (let right = 0; right < palindromeValues.length; right++) {
    stack.push(right)
    steps.push({ phase: 'descend', slow: null, fast: null, left: 0, right, reversed: false, compared: [], stack: [...stack], lineId: 'r-call', message: '递：right 位于节点 ' + (right + 1) + '，继续调用 traverse(right.next)' })
  }
  steps.push({ phase: 'descend', slow: null, fast: null, left: 0, right: null, reversed: false, compared: [], stack: [...stack], lineId: 'r-base', message: 'right 到达 null，递归到底；从这里开始逐层返回' })
  const compared: number[] = []
  let left = 0
  for (let right = palindromeValues.length - 1; right >= 0; right--) {
    steps.push({ phase: 'compare', slow: null, fast: null, left, right, reversed: false, compared: [...new Set(compared)], stack: [...stack], lineId: 'r-compare', message: '归：left.val = ' + palindromeValues[left] + '，right.val = ' + palindromeValues[right] + '，两者相等' })
    compared.push(left, right)
    stack.pop()
    left++
    steps.push({ phase: 'compare', slow: null, fast: null, left: left < palindromeValues.length ? left : null, right, reversed: false, compared: [...new Set(compared)], stack: [...stack], lineId: 'r-move', message: '当前层比较通过，left = left.next；right 随递归返回自然向左' })
  }
  steps.push({ phase: 'done', slow: null, fast: null, left: null, right: null, reversed: false, compared: [0,1,2,3,4], stack: [], lineId: 'r-call-main', message: '所有递归层都返回 true，链表是回文链表' })
  return steps
}

function halfSteps(): PalindromeStep[] {
  const steps: PalindromeStep[] = [
    { phase: 'start', slow: 0, fast: 0, left: null, right: null, reversed: false, compared: [], stack: [], lineId: 'h-mid-init', message: 'slow 与 fast 都从表头出发，寻找后半段起点' },
    { phase: 'middle', slow: 1, fast: 2, left: null, right: null, reversed: false, compared: [], stack: [], lineId: 'h-fast', message: 'slow 走一步到节点 2，fast 走两步到中点 3' },
    { phase: 'middle', slow: 2, fast: 4, left: null, right: null, reversed: false, compared: [], stack: [], lineId: 'h-mid-return', message: 'fast 已在尾节点，fast.next 为 null；slow 停在中点，也就是后半段起点' },
  ]

  let prev: number[] = []
  let remaining = [2, 3, 4]
  steps.push({ phase: 'reverse', slow: null, fast: null, left: null, right: null, reversed: false, compared: [], stack: [], lineId: 'h-prev', message: '进入 reverseList(mid)：prev = null，head 指向中点 node 3', reversePrev: [], reverseRemaining: [...remaining], reverseHead: 2, reverseNext: 3, reverseStage: 'init' })
  while (remaining.length) {
    const head = remaining[0]
    const next = remaining[1] ?? null
    steps.push({ phase: 'reverse', slow: null, fast: null, left: null, right: null, reversed: false, compared: [], stack: [], lineId: 'h-next', message: '先保存 next = ' + (next === null ? 'null' : 'node ' + (next + 1)) + '；否则改写 next 后会丢失剩余链表', reversePrev: [...prev], reverseRemaining: [...remaining], reverseHead: head, reverseNext: next, reverseStage: 'save' })
    const linked = [head, ...prev]
    steps.push({ phase: 'reverse', slow: null, fast: null, left: null, right: null, reversed: false, compared: [], stack: [], lineId: 'h-link', message: 'head.next = prev：node ' + (head + 1) + ' 已接到已反转链表前面', reversePrev: linked, reverseRemaining: remaining.slice(1), reverseHead: head, reverseNext: next, reverseStage: 'link' })
    prev = linked
    steps.push({ phase: 'reverse', slow: null, fast: null, left: null, right: null, reversed: false, compared: [], stack: [], lineId: 'h-shift-prev', message: 'prev = head：已反转部分的表头更新为 node ' + (head + 1), reversePrev: [...prev], reverseRemaining: remaining.slice(1), reverseHead: head, reverseNext: next, reverseStage: 'prev' })
    remaining = remaining.slice(1)
    steps.push({ phase: 'reverse', slow: null, fast: null, left: null, right: null, reversed: false, compared: [], stack: [], lineId: 'h-shift-head', message: 'head = next：继续处理' + (next === null ? '完毕，head 到达 null' : ' node ' + (next + 1)), reversePrev: [...prev], reverseRemaining: [...remaining], reverseHead: next, reverseNext: remaining[1] ?? null, reverseStage: 'head' })
  }
  steps.push({ phase: 'reverse', slow: null, fast: null, left: null, right: null, reversed: true, compared: [], stack: [], lineId: 'h-reverse-return', message: 'reverseList 返回 prev：后半段已由 3 → 2 → 1 变为 1 → 2 → 3', reversePrev: [...prev], reverseRemaining: [], reverseHead: null, reverseNext: null, reverseStage: 'done' })
  steps.push(
    { phase: 'compare', slow: null, fast: null, left: 0, right: 4, reversed: true, compared: [], stack: [], lineId: 'h-compare', message: 'head 的 1 与 head2 的 1 相等' },
    { phase: 'compare', slow: null, fast: null, left: 1, right: 3, reversed: true, compared: [0,4], stack: [], lineId: 'h-compare', message: '两个指针继续前进：2 与 2 相等' },
    { phase: 'compare', slow: null, fast: null, left: 2, right: 2, reversed: true, compared: [0,1,3,4], stack: [], lineId: 'h-compare', message: '最后比较中点：3 与 3 相等' },
    { phase: 'done', slow: null, fast: null, left: null, right: null, reversed: true, compared: [0,1,2,3,4], stack: [], lineId: 'h-true', message: 'head2 走到 null，后半段全部匹配，返回 true' },
  )
  return steps
}

export const makePalindromeSteps = (method: PalindromeMethod) => method === 'recursive' ? recursiveSteps() : halfSteps()
