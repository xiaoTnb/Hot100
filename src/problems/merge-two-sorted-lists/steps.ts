import type { CodeLine, PlayerMethod } from '../../components/player/types'
export type MergeListMethod = 'iterative' | 'recursive'
export interface MergeListStep { i: number; j: number; merged: number[]; pickedFrom: 'l1' | 'l2' | 'rest' | null; phase: 'start' | 'pick' | 'rest' | 'call' | 'base' | 'unwind' | 'done'; stack: string[]; lineId: string; message: string }
export const mergeListA = [1, 2, 4], mergeListB = [1, 3, 4]
export const mergeListMethods: PlayerMethod[] = [
  { id: 'iterative', label: '迭代 · 哨兵尾插', complexity: 'O(M+N) · O(1)', languages: ['java'] },
  { id: 'recursive', label: '递归 · 头插', complexity: 'O(M+N) · O(M+N)', languages: ['java'] },
]
const iterativeCode: CodeLine[] = [
  { id: 'i-class', text: 'class Solution {' }, { id: 'i-method', text: '  public ListNode mergeTwoLists(ListNode list1, ListNode list2) {' }, { id: 'i-dummy', text: '    ListNode dummy = new ListNode();' }, { id: 'i-cur', text: '    ListNode cur = dummy;' }, { id: 'i-while', text: '    while (list1 != null && list2 != null) {' }, { id: 'i-if', text: '      if (list1.val < list2.val) {' }, { id: 'i-pick-1', text: '        cur.next = list1;' }, { id: 'i-move-1', text: '        list1 = list1.next;' }, { id: 'i-else', text: '      } else {' }, { id: 'i-pick-2', text: '        cur.next = list2;' }, { id: 'i-move-2', text: '        list2 = list2.next;' }, { id: 'i-if-close', text: '      }' }, { id: 'i-cur-move', text: '      cur = cur.next;' }, { id: 'i-while-close', text: '    }' }, { id: 'i-rest', text: '    cur.next = list1 != null ? list1 : list2;' }, { id: 'i-return', text: '    return dummy.next;' }, { id: 'i-method-close', text: '  }' }, { id: 'i-class-close', text: '}' },
]
const recursiveCode: CodeLine[] = [
  { id: 'r-class', text: 'class Solution {' }, { id: 'r-method', text: '  public ListNode mergeTwoLists(ListNode list1, ListNode list2) {' }, { id: 'r-base-1', text: '    if (list1 == null) return list2;' }, { id: 'r-base-2', text: '    if (list2 == null) return list1;' }, { id: 'r-if', text: '    if (list1.val < list2.val) {' }, { id: 'r-link-1', text: '      list1.next = mergeTwoLists(list1.next, list2);' }, { id: 'r-return-1', text: '      return list1;' }, { id: 'r-else', text: '    } else {' }, { id: 'r-link-2', text: '      list2.next = mergeTwoLists(list1, list2.next);' }, { id: 'r-return-2', text: '      return list2;' }, { id: 'r-close', text: '    }' }, { id: 'r-method-close', text: '  }' }, { id: 'r-class-close', text: '}' },
]
export const getMergeListCode = (method: MergeListMethod) => method === 'iterative' ? iterativeCode : recursiveCode

function iterativeSteps(): MergeListStep[] {
  let i = 0, j = 0
  const merged: number[] = [], steps: MergeListStep[] = [{ i, j, merged: [], pickedFrom: null, phase: 'start', stack: [], lineId: 'i-dummy', message: '创建 dummy 哨兵和尾指针 cur，统一处理第一个节点' }]
  while (i < mergeListA.length && j < mergeListB.length) {
    if (mergeListA[i] < mergeListB[j]) { merged.push(mergeListA[i]); i++; steps.push({ i, j, merged: [...merged], pickedFrom: 'l1', phase: 'pick', stack: [], lineId: 'i-pick-1', message: 'list1 当前值更小，cur.next 接入 list1，并移动 list1' }) }
    else { merged.push(mergeListB[j]); j++; steps.push({ i, j, merged: [...merged], pickedFrom: 'l2', phase: 'pick', stack: [], lineId: 'i-pick-2', message: 'list2 当前值更小或相等，cur.next 接入 list2，并移动 list2' }) }
  }
  const rest = i < mergeListA.length ? mergeListA.slice(i) : mergeListB.slice(j)
  merged.push(...rest); i = mergeListA.length; j = mergeListB.length
  steps.push({ i, j, merged: [...merged], pickedFrom: 'rest', phase: 'rest', stack: [], lineId: 'i-rest', message: '一条链表耗尽，剩余链段本身有序，直接整体接到 cur 后面' })
  steps.push({ i, j, merged, pickedFrom: null, phase: 'done', stack: [], lineId: 'i-return', message: '跳过 dummy，返回 dummy.next' })
  return steps
}

function recursiveSteps(): MergeListStep[] {
  let i = 0, j = 0
  const picks: Array<{ from: 'l1' | 'l2'; value: number; i: number; j: number }> = [], steps: MergeListStep[] = []
  while (i < mergeListA.length && j < mergeListB.length) {
    const from = mergeListA[i] < mergeListB[j] ? 'l1' : 'l2'
    const value = from === 'l1' ? mergeListA[i++] : mergeListB[j++]
    picks.push({ from, value, i, j })
    steps.push({ i, j, merged: [], pickedFrom: from, phase: 'call', stack: picks.map((p) => p.from + ': ' + p.value), lineId: from === 'l1' ? 'r-link-1' : 'r-link-2', message: '选择 ' + from + ' 的节点 ' + value + ' 作为当前层头节点，递归合并剩余部分' })
  }
  const merged = i < mergeListA.length ? mergeListA.slice(i) : mergeListB.slice(j)
  steps.push({ i, j, merged: [...merged], pickedFrom: 'rest', phase: 'base', stack: picks.map((p) => p.from + ': ' + p.value), lineId: i >= mergeListA.length ? 'r-base-1' : 'r-base-2', message: '遇到 null，直接返回另一条链表的剩余部分 [' + merged.join(', ') + ']' })
  while (picks.length) {
    const pick = picks.pop() as { from: 'l1' | 'l2'; value: number; i: number; j: number }
    merged.unshift(pick.value)
    steps.push({ i: pick.i, j: pick.j, merged: [...merged], pickedFrom: pick.from, phase: 'unwind', stack: picks.map((p) => p.from + ': ' + p.value), lineId: pick.from === 'l1' ? 'r-return-1' : 'r-return-2', message: '递归返回：让节点 ' + pick.value + '.next 指向已合并链表，并返回节点 ' + pick.value })
  }
  steps.push({ i: mergeListA.length, j: mergeListB.length, merged, pickedFrom: null, phase: 'done', stack: [], lineId: 'r-return-2', message: '最外层返回合并后头节点 [1, 1, 2, 3, 4, 4]' })
  return steps
}
export const makeMergeListSteps = (method: MergeListMethod) => method === 'iterative' ? iterativeSteps() : recursiveSteps()
