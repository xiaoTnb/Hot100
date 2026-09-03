import type { CodeLine, PlayerMethod } from '../../components/player/types'

export type SubstringPhase = 'ready' | 'remove' | 'expand' | 'blocked' | 'update' | 'done'
export interface SubstringStep { i: number; rk: number; occ: string[]; duplicateIndex: number; ans: number; phase: SubstringPhase; lineId: string; message: string }

export const substringInput = 'abcabcbb'
export const substringMethods: PlayerMethod[] = [{ id: 'window', label: '滑动窗口', complexity: 'O(N)' }]
export const substringCode: CodeLine[] = [
  { id: 'class', text: 'class Solution {' },
  { id: 'method', text: '  public int lengthOfLongestSubstring(String s) {' },
  { id: 'set', text: '    Set<Character> occ = new HashSet<Character>();' },
  { id: 'n', text: '    int n = s.length();' },
  { id: 'init', text: '    int rk = -1, ans = 0;' },
  { id: 'loop', text: '    for (int i = 0; i < n; ++i) {' },
  { id: 'if', text: '      if (i != 0) {' },
  { id: 'remove', text: '        occ.remove(s.charAt(i - 1));' },
  { id: 'if-close', text: '      }' },
  { id: 'while', text: '      while (rk + 1 < n && !occ.contains(s.charAt(rk + 1))) {' },
  { id: 'add', text: '        occ.add(s.charAt(rk + 1));' },
  { id: 'right', text: '        ++rk;' },
  { id: 'while-close', text: '      }' },
  { id: 'answer', text: '      ans = Math.max(ans, rk - i + 1);' },
  { id: 'loop-close', text: '    }' },
  { id: 'return', text: '    return ans;' },
  { id: 'method-close', text: '  }' },
  { id: 'class-close', text: '}' },
]

export function makeSubstringSteps(): SubstringStep[] {
  const occ = new Set<string>()
  const steps: SubstringStep[] = [{ i: 0, rk: -1, occ: [], duplicateIndex: -1, ans: 0, phase: 'ready', lineId: 'init', message: '初始化：窗口为空，右指针 rk = -1，最长长度 ans = 0' }]
  let rk = -1, ans = 0
  for (let i = 0; i < substringInput.length; i++) {
    if (i !== 0) {
      const removed = substringInput[i - 1]
      occ.delete(removed)
      steps.push({ i, rk, occ: [...occ], duplicateIndex: -1, ans, phase: 'remove', lineId: 'remove', message: `左边界从 ${i - 1} 移到 ${i}，移除字符 “${removed}”；窗口可以继续向右尝试` })
    }
    while (rk + 1 < substringInput.length && !occ.has(substringInput[rk + 1])) {
      const nextIndex = rk + 1
      const next = substringInput[nextIndex]
      occ.add(next)
      rk++
      steps.push({ i, rk, occ: [...occ], duplicateIndex: -1, ans, phase: 'expand', lineId: 'right', message: `下一个字符 s[${nextIndex}] = “${next}” 不在 Set 中：加入窗口，rk 右移到 ${rk}` })
    }
    if (rk + 1 < substringInput.length) {
      const nextIndex = rk + 1
      const duplicate = substringInput[nextIndex]
      steps.push({ i, rk, occ: [...occ], duplicateIndex: nextIndex, ans, phase: 'blocked', lineId: 'while', message: `s[${nextIndex}] = “${duplicate}” 已在 Set 中；继续加入会重复，所以停止扩张右边界` })
    }
    const length = rk - i + 1
    const previous = ans
    ans = Math.max(ans, length)
    steps.push({ i, rk, occ: [...occ], duplicateIndex: -1, ans, phase: 'update', lineId: 'answer', message: ans > previous ? `当前无重复子串 “${substringInput.slice(i, rk + 1)}” 长度为 ${length}，ans 更新为 ${ans}` : `当前子串 “${substringInput.slice(i, rk + 1)}” 长度为 ${length}，没有超过 ans = ${ans}` })
  }
  steps.push({ i: substringInput.length, rk, occ: [], duplicateIndex: -1, ans, phase: 'done', lineId: 'return', message: `左右指针各自只向右移动，遍历结束，返回最长长度 ${ans}` })
  return steps
}
